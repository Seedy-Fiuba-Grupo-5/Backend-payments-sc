const transactionsRepo = require('../db/repositories/transactionsRepo');
const { log } = require("../log");

async function process(data) {
  projectRepr = await transactionsRepo.get(data.transactionId);
  return projectRepr;
}

module.exports = { process };
