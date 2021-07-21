const ethers = require("ethers");
const { 
  hhNodeURL, 
  network, 
  infuraApiKey, 
  nodeENV, 
  deployerMnemonic 
} = require("../config");

function createEthersProvider() {
  if (nodeENV === 'development') {
    return new ethers.providers.JsonRpcProvider(hhNodeURL);
  }
  return new ethers.providers.InfuraProvider(network, infuraApiKey);
}

function getDeployerWallet() {
  const provider = createEthersProvider();
  return ethers.Wallet.fromMnemonic(deployerMnemonic).connect(provider);
};

function getFromPrivateKey(privateKey) {
  const provider = createEthersProvider();
  return new ethers.Wallet(privateKey).connect(provider);
}

async function create() {
  const provider = createEthersProvider();
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  return wallet;
};

async function balance(walletAddress) {
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
