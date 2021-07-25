const ethers = require("ethers");
const { 
  hhNodeURL, 
  network, 
  infuraApiKey, 
  nodeENV, 
  deployerMnemonic 
} = require("../config");
const { log } = require('../log');

function walletEthersLog(message) {
  fullMesage = `Wallet Ethers: ${message}`;
  log(fullMesage);
}

function createEthersProvider() {
  if (nodeENV === 'development') {
    return new ethers.providers.JsonRpcProvider(hhNodeURL);
  }
  return new ethers.providers.InfuraProvider(network, infuraApiKey);
}

function getDeployerWallet() {
  walletEthersLog('Getting deployer wallet');
  const provider = createEthersProvider();
  return ethers.Wallet.fromMnemonic(deployerMnemonic).connect(provider);
};

function getFromPrivateKey(privateKey) {
  walletEthersLog('Getting wallet from private key');
  const provider = createEthersProvider();
  return new ethers.Wallet(privateKey).connect(provider);
}

async function create() {
  walletEthersLog('Creating new wallet');
  const provider = createEthersProvider();
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  return wallet;
};

async function balance(walletAddress) {
  walletEthersLog(`Getting balance of wallet with address: ${walletAddress}`);
  const provider = createEthersProvider();
  const weis = await provider.getBalance(walletAddress);
  const balance = ethers.utils.formatEther(weis);
  return balance;
};

module.exports = {
  getDeployerWallet,
  getFromPrivateKey,
  balance,
  create
};
