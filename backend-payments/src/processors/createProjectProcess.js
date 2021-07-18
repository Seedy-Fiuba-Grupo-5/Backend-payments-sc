const { createProjectDB, getProjectDB } = require("../db/repositories/projectsRepo");
const { mineAProject } = require("./mineAProject");
const { log } = require("../log");

async function createProjectProcess(data) {
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
  await createProjectDB(dataDict);
  await mineAProject(data.publicId);
  projectRepr = await getProjectDB(data.publicId);
  return projectRepr;
}

module.exports = { createProjectProcess };
