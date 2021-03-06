const { log } = require("../log");
const sc = require('./smartContract');
const walletsEthers = require("../ethers/walletsEthers");
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
  let tx;
  try {
    tx = await seedyFiubaContract.setCompletedStage(projectSCId, stageIndex);
  } catch(error) {
    log(`Set completed stage transaction ${transcationId} failed:`);
    console.log(error);
    await transactionsRepo.update(transcationId, { transactionState: 'Not enough balance' });
    return;
  }

  await transactionsRepo.update(transcationId, {transactionState: 'Mining'});

  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    const secondEvent = receipt && receipt.events && receipt.events[1];

    updatesTransactionDict = null;
    if (firstEvent && firstEvent.event === "StageCompleted") {
      console.log(firstEvent);
      const projectId = firstEvent.args.projectId.toNumber();
      const stageCompleted = firstEvent.args.stageCompleted.toNumber();
      log(`Event 'StageCompleted': ` +
          `\n\tprojectId: ${projectId}` +
          `\n\tstageCompleted: ${stageCompleted}`
          );
      updatesTransactionDict = { transactionState: 'Done' };
      projectsRepo.setCompletedStage(projectPublicId, stageIndex);
    } else {
      log(`Set completed stage transaction failed:\n\ttx hash: ${tx.hash}\n\ttx id: ${transcationId} `);
      updatesTransactionDict = { transactionState: 'Failed'};
    }

    if (secondEvent && secondEvent.event === "ProjectCompleted") {
      console.log(secondEvent);
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
