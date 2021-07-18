const { getProjectDB, updateProjectDB } = require("../db/repositories/projectsRepo");
const mineAProject = require("./mineAProject");
const { log } = require("../log");

async function patchProjectProcess(data) {
  projectRepr = await getProjectDB(data.publicId);
  if (projectRepr === null) {
    log(`Project not found`);
    return null;
  }
  log(`Project found`);
  updatesDict = {reviewerPublicId: data.reviewerPublicId}
  await updateProjectDB(data.publicId, updatesDict);
  log(`Reviewer updated to ${data.reviewerPublicId}`);
  await mineAProject.process(data.publicId);
  projectRepr = await getProjectDB(data.publicId);
  return projectRepr;
}

module.exports = { patchProjectProcess };
