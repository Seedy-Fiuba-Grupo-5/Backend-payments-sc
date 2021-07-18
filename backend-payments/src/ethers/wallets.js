const ethers = require("ethers");
const { 
  hh_node_url, 
  network, 
  infuraApiKey, 
  node_env, 
  deployerMnemonic 
} = require("../config");

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

async function create() {
  const provider = create_ethers_provider();
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  return wallet;
};

async function balance(walletAddress) {
  const provider = create_ethers_provider();
  const weis = await provider.getBalance(walletAddress);
  const balance = ethers.utils.formatEther(weis);
  return balance;
};

module.exports = {
  getDeployerWallet,
  balance,
  create
};
