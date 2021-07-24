const { log } = require("../log");
const sc = require('./smartContract');
const walletsEthers = require("../ethers/walletsEthers");
const { ethersToWeis, weisToEthers } = require('../ethers/utilsEthers');
const transactionsRepo = require("../db/repositories/transactionsRepo");
const projectsRepo = require("../db/repositories/projectsRepo");

async function fund(
  amountEthers,
  funderPrivateKey,
  projectSCId,
  transcationId,
  projectPublicId
  ) {
  const funderWallet = walletsEthers.getFromPrivateKey(funderPrivateKey);
  const seedyFiubaContract = await sc.getContract(funderWallet);
  const overrides = { value: ethersToWeis(amountEthers) };
  let tx;
  try {
    tx = await seedyFiubaContract.fund(projectSCId, overrides);
  } catch(error) {
    errorBodyParsed = JSON.parse(error.body);
    message = errorBodyParsed.error.message;
    console.log(`Transaction ${transcationId} failed:`);
    console.log(message);
    await transactionsRepo.update(transcationId, { transactionState: 'NOT_ENOUGH_BALANCE' });
    return;
  }
  await transactionsRepo.update(transcationId, { transactionState: 'mining' });
  console.log(`Transaction ${transcationId} in progress ...`);
  tx.wait(1).then(receipt => {
    console.log(`Transaction ${transcationId} mined`);
    const firstEvent = receipt && receipt.events && receipt.events[0];
    const secondEvent = receipt && receipt.events && receipt.events[1];
    console.log(firstEvent);
    console.log(secondEvent);
    updatesTransactionDict = null;
    if (firstEvent && firstEvent.event === "ProjectFunded") {
      const projectId = firstEvent.args.projectId.toNumber();
      const funderAddress = firstEvent.args.funder.toString();
      const funds = firstEvent.args.funds; // Do not convert BigNumber to Number
      log(`Event 'ProjectFunded': ` +
          `\n\tprojectId: ${projectId}` +
          `\n\tfunderAddress: ${funderAddress}` +
          `\n\tfunds: ${funds} weis`
          );
      updatesTransactionDict = { transactionState: 'done', amountEthers: weisToEthers(funds)};
      projectsRepo.addBalance(projectPublicId, weisToEthers(funds));
    } else {
      log(`Transaciont ${transcationId} failed: ???`);
      updatesTransactionDict = { transactionState: 'failed'};
    }

    if (secondEvent && secondEvent.event === "ProjectStarted") {
      const projectId = secondEvent.args.projectId.toNumber();
      log(`Event 'ProjectStarted': ` +
          `\n\tprojectId: ${projectId}`
          );
      updatesProjectDict = { state: projectsRepo.IN_PROGRESS};
      projectsRepo.update(projectPublicId, updatesProjectDict);
    }

    transactionsRepo.update(transcationId, updatesTransactionDict);
  });
}

module.exports = { fund };
