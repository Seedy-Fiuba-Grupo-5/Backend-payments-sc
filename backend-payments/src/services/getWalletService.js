const { log } = require("../log");
const walletsRepo = require('../db/repositories/walletsRepo');
const walletsEthers = require('../ethers/walletsEthers');

async function process(data) {
  walletInst = await walletsRepo.get(data.publicId);
  if (walletInst === null) {
    log('Wallet not found');
    return 'WALLET_NOT_FOUND';
  }
  balance = await walletsEthers.balance(walletInst.dataValues.address);
  result = {
    publicId: walletInst.dataValues.publicId,
    address: walletInst.dataValues.address,
    privateKey: walletInst.dataValues.privateKey,
    balance: balance
  }
  return result;
}

module.exports = { process };
