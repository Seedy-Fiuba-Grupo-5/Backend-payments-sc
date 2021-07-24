const walletsRepo = require('../db/repositories/walletsRepo');
const walletsEthers = require('../ethers/walletsEthers');
const { log } = require("../log");

async function process(data) {
  repr = await walletsRepo.get(data.publicId);
  balance = await walletsEthers.balance(repr.dataValues.address);
  result = {
    publicId: repr.dataValues.publicId,
    address: repr.dataValues.address,
    privateKey: repr.dataValues.privateKey,
    balance: balance
  }
  return result;
}

module.exports = { process };
