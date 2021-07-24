const { log } = require("../log");
const sc = require('./smartContract');
const walletsEthers = require("./wallets");
const { ethersToWeis, weisToEthers } = require('./utils');
const transactionsRepo = require("../db/repositories/transactionsRepo");
const projectsRepo = require("../db/repositories/projectsRepo");

async function fund(
  amountEthers,
  funderPrivateKey,
  projectSCId,
  transcationId,
  projectPublicId
  ) {
  log(`Mining 'fund' transaction ${transcationId}`);
  const funderWallet = walletsEthers.getFromPrivateKey(funderPrivateKey);
  const seedyFiubaContract = await sc.getContract(funderWallet);
  let overrides = { value: ethersToWeis(amountEthers) };
  const tx = await seedyFiubaContract.fund(projectSCId, overrides);
  await transactionsRepo.update(transcationId, {transactionState: 'mining'});

  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    const secondEvent = receipt && receipt.events && receipt.events[1];
    // This could also be a ProjectStarted event
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
      log(`Fund tx ${tx.hash}: failed`);
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
