const projectsRepo = require("../db/repositories/projectsRepo");
const mineAProject = require("./mineAProject");
const { log } = require("../log");

async function process(data) {
  log(`Building project ${data.publicId}`);
  const creationStatus = "building";
  const dataDict = {
    publicId: data.publicId,
    privateId: null,
    creationStatus: creationStatus,
    stagesCost: data.stagesCost,
    ownerPublicId: data.ownerPublicId,
    reviewerPublicId: data.reviewerPublicId,
    balance: null
  };
  await projectsRepo.create(dataDict);
  await mineAProject.process(data.publicId);
  projectRepr = await projectsRepo.get(data.publicId);
  return projectRepr;
}

module.exports = { process };
