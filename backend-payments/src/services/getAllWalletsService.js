const { log } = require("../log");
const walletsRepo = require('../db/repositories/walletsRepo');

async function process(_data) {
  log('Looking for all wallets')
  allInst = await walletsRepo.getAll();
  return allInst;
}

module.exports = { process };
