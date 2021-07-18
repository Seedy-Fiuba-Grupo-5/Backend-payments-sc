const projectsRepo = require('../db/repositories/projectsRepo');
const { log } = require("../log");

async function process(data) {
  projectRepr = await projectsRepo.get(data.publicId);
  return projectRepr;
}

module.exports = { process };
