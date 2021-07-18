const walletsRepo = require('../db/repositories/walletsRepo');
const { log } = require("../log");

async function process(_data) {
  allRepr = await walletsRepo.getAll();
  result = allRepr;
  return result;
}

module.exports = { process };
