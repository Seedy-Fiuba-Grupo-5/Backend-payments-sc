const walletsRepo = require('../db/repositories/walletsRepo');
const projectsRepo = require("../db/repositories/projectsRepo");
const transactionsRepo = require("../db/repositories/transactionsRepo");
const { setCompletedStage } = require('../smartContract/setCompletedStageSmartContract');
const {calculateAmountEthersOfStagesWithCompleted} = require('../ethers/utilsEthers');
const { log } = require("../log");
const {IN_PROGRESS} = require('../db/repositories/projectsRepo')

async function process(data) {
  log(`Setting stage ${data.stageNumber} of project ${data.projectPublicId} as completed`);
  stageIndex = data.stageNumber - 1;
  projectInst = await projectsRepo.get(data.projectPublicId);
  walletInst = await walletsRepo.get(data.reviewerPublicId);

  if (projectInst.dataValues.state !== IN_PROGRESS) {
   log('Tried to set a stage as completed in a project which state isn\'t in progress');
   console.log(projectInst.dataValues.state);
    transactionRepr = {
      transactionState: 'NOT_IN_PROGRESS'
    };
   return transactionRepr;
  }

  transactionDict = {
    amountEthers: calculateAmountEthersOfStagesWithCompleted(projectInst, data.stageNumber),
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
    stageIndex,
    walletInst.dataValues.privateKey,
    transactionInst.id,
    data.projectPublicId
  );

  transactionInst = await transactionsRepo.get(transactionInst.id);

  return transactionInst.dataValues;
}

module.exports = { process };
