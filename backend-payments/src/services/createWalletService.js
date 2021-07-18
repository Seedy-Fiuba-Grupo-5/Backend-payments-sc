const walletsEther = require("../ethers/wallets");
const walletsRepo = require("../db/repositories/walletsRepo");
const { log } = require("../log");

async function process(data) {
  wallet = await walletsEther.create(data.publicId);
  dataDict = {
    publicId: data.publicId,
    address: wallet.address,
    privateKey: wallet.privateKey
  }
  walletRepr = await walletsRepo.create(dataDict);
  const result = {
    publicId: walletRepr.publicId,
    address: walletRepr.address,
    privateKey: walletRepr.privateKey
  };
  return result;
}

module.exports = { process };
