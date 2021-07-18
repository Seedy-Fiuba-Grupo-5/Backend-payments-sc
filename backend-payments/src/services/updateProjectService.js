const projectsRepo = require("../db/repositories/projectsRepo");
const mineAProject = require("./mineAProject");
const { log } = require("../log");

async function process(data) {
  projectRepr = await projectsRepo.get(data.publicId);
  if (projectRepr === null) {
    log(`Project not found`);
    return null;
  }
  log(`Project found`);

  updatesDict = {reviewerPublicId: data.reviewerPublicId}
  await projectsRepo.update(data.publicId, updatesDict);
  log(`Reviewer updated to ${data.reviewerPublicId}`);
  
  await mineAProject.process(data.publicId);
  projectRepr = await projectsRepo.get(data.publicId);
  
  return projectRepr;
}

module.exports = { process };
