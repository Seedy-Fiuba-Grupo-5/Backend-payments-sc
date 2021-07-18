const ethers = require("ethers");
const { 
  hh_node_url, 
  network, 
  infuraApiKey, 
  node_env, 
  deployerMnemonic 
} = require("../config");
const { createWalletDB, getAllWalletsDB, getWalletDB } = require("../db/repositories/walletsRepo");

function create_ethers_provider() {
  if (node_env === 'development') {
    return new ethers.providers.JsonRpcProvider(hh_node_url);
  }
  return new ethers.providers.InfuraProvider(network, infuraApiKey);
}

function getDeployerWallet() {
  const provider = create_ethers_provider();
  return ethers.Wallet.fromMnemonic(deployerMnemonic).connect(provider);
};

async function createWallet(publicId) {
  const provider = create_ethers_provider();
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  dataDict = {
    publicId: publicId,
    address: wallet.address,
    privateKey: wallet.privateKey
  }
  const walletRepr = await createWalletDB(dataDict);
  const result = {
    publicId: walletRepr.publicId,
    address: walletRepr.address,
    privateKey: walletRepr.privateKey
  };
  return result;
};

async function getWalletsData() {
  const allWallets = await getAllWalletsDB();
  let result = [];
  allWallets.every(
    walletRepr => result.push({
      publicId: walletRepr.dataValues.publicId,
      address: walletRepr.dataValues.address,
      privateKey: walletRepr.dataValues.privateKey
    })
  );
  return result;
};

async function getWalletData(publicId) {
  const walletRepr = await getWalletDB(publicId);

  const provider = create_ethers_provider();
  const weis = await provider.getBalance(walletRepr.dataValues.address);
  const balance = ethers.utils.formatEther(weis);

  const result = {
    publicId: walletRepr.dataValues.publidId,
    address: walletRepr.dataValues.address,
    privateKey: walletRepr.dataValues.privateKey,
    balance: balance
  };
  return result;
};

module.exports = {
  createWallet,
  getDeployerWallet,
  getWalletsData,
  getWalletData
};
