const transactionsRepo = require('../db/repositories/transactionsRepo');
const { log } = require("../log");

async function process(queryDict) {
  projectRepr = await transactionsRepo.find(queryDict);
  return projectRepr;
}

module.exports = { process };
