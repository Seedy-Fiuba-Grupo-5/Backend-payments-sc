const { createWallet } = require("../ethers/wallets");
const { createWalletDB } = require("../db/repositories/walletsRepo");
const { log } = require("../log");

async function createWalletProcess(data) {
  wallet = await createWallet(data.publicId);
  dataDict = {
    publicId: data.publicId,
    address: wallet.address,
    privateKey: wallet.privateKey
  }
  walletRepr = await createWalletDB(dataDict);
  const result = {
    publicId: walletRepr.publicId,
    address: walletRepr.address,
    privateKey: walletRepr.privateKey
  };
  return result;
}

module.exports = { createWalletProcess };
