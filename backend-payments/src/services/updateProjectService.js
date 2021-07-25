const { log } = require("../log");
const projectsRepo = require("../db/repositories/projectsRepo");
const walletsRepo = require("../db/repositories/walletsRepo");
const mineAProject = require("./mineCreateProjectService");

async function process(data) {
  projectInst = await projectsRepo.get(data.publicId);
  if (projectInst === null) {
    log(`Project not found`);
    return { creationStatus: 'PROJECT_NOT_FOUND' };
  }
  log(`Project found`);

  if (projectInst.dataValues.reviewerPublicId >= 0) {
    log(`Already exists a reviewer`);
    return { creationStatus: 'REVIEWER_OVERWRITE' };
  }
  
  reviewerWalletInst = await walletsRepo.get(data.reviewerPublicId);
  console.log("reviewerWallet")
  console.log(reviewerWalletInst);
  if (reviewerWalletInst === null) {
    log('Reviewer wallet not found');
    return { creationStatus: 'REVIEWER_NOT_FOUND' };
  }
  log(`Reviewer wallet found`);

  updatesDict = {reviewerPublicId: data.reviewerPublicId}
  await projectsRepo.update(data.publicId, updatesDict);
  log(`Reviewer updated to ${data.reviewerPublicId}`);

  await mineAProject.process(data.publicId);
  projectInst = await projectsRepo.get(data.publicId);

  return projectInst.dataValues;
}

module.exports = { process };
