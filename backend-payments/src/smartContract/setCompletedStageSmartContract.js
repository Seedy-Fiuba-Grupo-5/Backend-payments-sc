const { log } = require("../log");
const sc = require('./smartContract');
const walletsEthers = require("../ethers/wallets");
const transactionsRepo = require("../db/repositories/transactionsRepo");
const projectsRepo = require("../db/repositories/projectsRepo");

async function setCompletedStage(
  projectSCId,
  stageIndex,
  reviewerPrivateKey,
  transcationId,
  projectPublicId
  ) {
  log(`Mining 'SetCompletedStage' transaction of id ${transcationId}`);
  const reviewerWallet = walletsEthers.getFromPrivateKey(reviewerPrivateKey);
  const seedyFiubaContract = await sc.getContract(reviewerWallet);
  const tx = await seedyFiubaContract.setCompletedStage(projectSCId, stageIndex);

  await transactionsRepo.update(transcationId, {transactionState: 'mining'});

  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    const secondEvent = receipt && receipt.events && receipt.events[1];
    console.log(firstEvent);
    console.log(secondEvent);

    updatesTransactionDict = null;
    if (firstEvent && firstEvent.event === "StageCompleted") {
      const projectId = firstEvent.args.projectId.toNumber();
      const stageCompleted = firstEvent.args.stageCompleted.toNumber();
      log(`Event 'StateCompleted': ` +
          `\n\tprojectId: ${projectId}` +
          `\n\tstageCompleted: ${stageCompleted}`
          );
      updatesTransactionDict = { transactionState: 'done' };
      projectsRepo.setCompletedStage(projectPublicId, stageIndex);
    } else {
      log(`StageCompleted tx ${tx.hash}: failed`);
      updatesTransactionDict = { transactionState: 'failed'};
    }

    if (secondEvent && secondEvent.event === "ProjectCompleted") {
      const projectId = secondEvent.args.projectId.toNumber();
      log(`Event 'ProjectCompleted': ` +
          `\n\tprojectId: ${projectId}`
          );
      updatesProjectDict = { state: projectsRepo.COMPLETED};
      projectsRepo.update(projectPublicId, updatesProjectDict);
    }

    transactionsRepo.update(transcationId, updatesTransactionDict);
  });
}

module.exports = { setCompletedStage };
