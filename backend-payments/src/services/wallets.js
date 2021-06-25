const ethers = require("ethers");
const db = require('./db');

function create_ethers_provider(config) {
  if (config.node_env == 'development') {
    return new ethers.providers.JsonRpcProvider(config.hh_node_local_url);
  }
  return new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
}

const getDeployerWallet = ({ config }) => () => {
  const provider = create_ethers_provider(config);
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = ({ config }) => async () => {
  const provider = create_ethers_provider(config);
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  db.accounts.push({
    address: wallet.address,
    privateKey: wallet.privateKey,
  });
  const result = {
    id: db.accounts.length,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
  return result;
};

const getWalletsData = ( {config} ) => () => {
  return db.accounts;
};

const getWalletData = ( {config} ) => index => {
  return db.accounts[index - 1];
};

const getWallet = ( {config} ) => index => {
  const provider = create_ethers_provider(config);
  return new ethers.Wallet(db.accounts[index - 1].privateKey, provider);
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
});
