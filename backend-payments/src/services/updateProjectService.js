const projectsRepo = require("../db/repositories/projectsRepo");
const walletsRepo = require("../db/repositories/walletsRepo");
const mineAProject = require("./mineCreateProjectService");
const { log } = require("../log");

async function process(data) {
  projectRepr = await projectsRepo.get(data.publicId);
  if (projectRepr === null) {
    log(`Project not found`);
    return null;
  }
  log(`Project found`);

  reviewerWallet = await walletsRepo.get(data.reviewerPublicId);
  console.log("reviewerWallet")
  console.log(reviewerWallet);
  if (reviewerWallet === null) {
    log('Reviewer Wallet not found');
    return null;
  }
  log(`Reviewer Wallet found`);

  updatesDict = {reviewerPublicId: data.reviewerPublicId}
  await projectsRepo.update(data.publicId, updatesDict);
  log(`Reviewer updated to ${data.reviewerPublicId}`);

  await mineAProject.process(data.publicId);
  projectRepr = await projectsRepo.get(data.publicId);

  return projectRepr;
}

module.exports = { process };
