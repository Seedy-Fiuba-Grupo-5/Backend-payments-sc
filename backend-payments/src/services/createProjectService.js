const projectsRepo = require("../db/repositories/projectsRepo");
const mineAProject = require("./mineCreateProjectService");
const { log } = require("../log");

async function process(data) {
  log(`Building project ${data.publicId}`);
  const creationStatus = "building";
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
