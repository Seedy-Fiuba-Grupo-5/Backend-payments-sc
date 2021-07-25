const { log } = require("../log");
const transactionsRepo = require('../db/repositories/transactionsRepo');

async function process(queryDict) {
  log('Looking for some transactions');
  projectRepr = await transactionsRepo.find(queryDict);
  return projectRepr;
}

module.exports = { process };
