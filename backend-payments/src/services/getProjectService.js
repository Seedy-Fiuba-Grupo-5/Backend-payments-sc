const { log } = require("../log");
const projectsRepo = require('../db/repositories/projectsRepo');

async function process(data) {
  projectInst = await projectsRepo.get(data.publicId);
  if (projectInst === null) {
    log('Project not found');
    return { creationStatus: 'PROJECT_NOT_FOUND' };
  }
  log('Project found');
  return projectInst;
}

module.exports = { process };
