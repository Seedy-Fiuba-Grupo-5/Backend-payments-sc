const { log } = require("../log");
const walletsEther = require("../ethers/walletsEthers");
const walletsRepo = require("../db/repositories/walletsRepo");

async function process(data) {
  wallet = await walletsEther.create(data.publicId);
  dataDict = {
    publicId: data.publicId,
    address: wallet.address,
    privateKey: wallet.privateKey
  }
  walletInst = await walletsRepo.create(dataDict);
  const result = {
    publicId: walletInst.publicId,
    address: walletInst.address,
    privateKey: walletInst.privateKey
  };
  return result;
}

module.exports = { process };
