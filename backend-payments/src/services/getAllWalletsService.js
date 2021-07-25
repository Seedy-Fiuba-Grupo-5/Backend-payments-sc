const { log } = require("../log");
const walletsRepo = require('../db/repositories/walletsRepo');

async function process(_data) {
  allInst = await walletsRepo.getAll();
  result = allInst;
  return result;
}

module.exports = { process };
