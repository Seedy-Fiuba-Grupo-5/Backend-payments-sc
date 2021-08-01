const { log } = require("../log");
const projectsRepo = require("../db/repositories/projectsRepo");
const walletsRepo = require("../db/repositories/walletsRepo");
const mineAProject = require("./mineCreateProjectService");
const { ethersToWeis } = require("../ethers/utilsEthers");

async function process(data) {
  ownerWallet = await walletsRepo.get(data.ownerPublicId);
  if (ownerWallet === null) {
    log('Owner wallet not found');
    return {creationStatus: 'OWNER_NOT_FOUND'};
  }
  log(`Owner wallet found`);

  reviewerWallet = await walletsRepo.get(data.reviewerPublicId);
  if (data.reviewerPublicId >= 0 && reviewerWallet === null) {
    log('Reviewer wallet not found');
    return {creationStatus: 'REVIEWER_NOT_FOUND'};
  }
  log(`Reviewer wallet found (if reviewer id was greater than 0)`);

  try {
    stagesCost.map((s)=>ethersToWeis(s));
  } catch(error) {
    log('Invalid stages costs');
    return {creationStatus: 'INVALID_STAGES_COSTS'};
  }

  log(`Building project ${data.publicId}`);
  const creationStatus = 'Building';
  const dataDict = {
    publicId: data.publicId,
    privateId: null,
    creationStatus: creationStatus,
    stagesCost: data.stagesCost,
    stagesStates: data.stagesCost.map(()=>false),
    ownerPublicId: data.ownerPublicId,
    reviewerPublicId: data.reviewerPublicId,
    balance: null,
    state: projectsRepo.INITIALIZING
  };

  await projectsRepo.create(dataDict);
  await mineAProject.process(data.publicId);
  projectRepr = await projectsRepo.get(data.publicId);
  return projectRepr.dataValues;
}

module.exports = { process };
