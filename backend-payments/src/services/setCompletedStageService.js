const { log } = require("../log");
const walletsRepo = require('../db/repositories/walletsRepo');
const projectsRepo = require("../db/repositories/projectsRepo");
const transactionsRepo = require("../db/repositories/transactionsRepo");
const { setCompletedStage } = require('../smartContract/setCompletedStageSmartContract');
const { calculateAmountEthersOfStagesWithCompleted } = require('../ethers/utilsEthers');
const { IN_PROGRESS } = require('../db/repositories/projectsRepo')

async function process(data) {
  log(`Setting stage ${data.stageNumber} of project ${data.projectPublicId} as completed`);
  
  projectInst = await projectsRepo.get(data.projectPublicId);
  if (projectInst === null) {
    log('Project not found');
    return { transactionState: 'PROJECT_NOT_FOUND' };
  }

  if (projectInst.dataValues.state !== IN_PROGRESS) {
    log('Tried to set a stage as completed in a project which state isn\'t in progress');
    console.log(projectInst.dataValues.state);
    return { transactionState: 'NOT_IN_PROGRESS' };
  }

  if (projectInst.dataValues.reviewerPublicId !== data.reviewerPublicId) {
    log('Not a reviewer of this projects');
    return { transactionState: 'INVALID_REVIEWER' };
  }
  walletInst = await walletsRepo.get(data.reviewerPublicId);

  if (data.stageNumber < 1 || data.stageNumber > projectInst.dataValues.stagesCost.length) {
    log('Invalid stage number');
    return { transactionState: 'INVALID_STAGE_NUMBER' };
  }

  stageIndex = data.stageNumber - 1;
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
