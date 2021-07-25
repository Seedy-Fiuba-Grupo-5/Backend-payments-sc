const { log } = require("../log");
const transactionsRepo = require('../db/repositories/transactionsRepo');

async function process(queryDict) {
  log('Looking for some transactions');
  let someTransactionInst; 
  try {
    someTransactionInst = await transactionsRepo.find(queryDict);
  } catch(error) {
    return null;
  }
  return someTransactionInst;
}

module.exports = { process };
