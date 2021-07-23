const walletsRepo = require('../db/repositories/walletsRepo');
const projectsRepo = require("../db/repositories/projectsRepo");
const transactionsRepo = require("../db/repositories/transactionsRepo");
const { setCompletedStage } = require('../ethers/setCompletedStageSmartContract');
const { log } = require("../log");

async function process(data) {
  log(`Setting stage ${data.stageNumber} of project ${data.projectPublicId} as completed`);

  projectInst = await projectsRepo.get(data.projectPublicId);
  walletInst = await walletsRepo.get(data.reviewerPublicId);
  transactionDict = {
    amountEthers: projectInst.dataValues.stagesCost[data.stageNumber-1],
    fromPublicId: data.projectPublicId,
    fromType: 'project',
    toPublicId: projectInst.dataValues.ownerPublicId,
    toType: 'user',
    transactionType: 'stageCompleted',
    transactionState: 'building'
  };
  transactionInst = await transactionsRepo.create(transactionDict);

  await setCompletedStage(
    projectInst.dataValues.privateId,
    data.stageNumber,
    walletInst.dataValues.privateKey,
    transactionInst.id,
    data.projectPublicId
  );

  transactionInst = await transactionsRepo.get(transactionInst.id);

  return transactionInst.dataValues;
}

module.exports = { process };
