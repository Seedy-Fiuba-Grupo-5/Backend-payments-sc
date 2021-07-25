const { log } = require("../log");
const transactionsRepo = require('../db/repositories/transactionsRepo');

async function process(data) {
  id = data.transactionId
  transactionInst = await transactionsRepo.get(id);
  if (transactionInst === null) {
    log(`Transaction ${id} not found`);
    return { transactionState: 'TRANSACTION_NOT_FOUND' };
  }
  log(`Transaction ${id} found`);
  return transactionInst;
}

module.exports = { process };
