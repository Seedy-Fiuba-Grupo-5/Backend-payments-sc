const ethers = require("ethers");
const { WalletDB } = require("../db/models/wallet");

function create_ethers_provider(config) {
  if (config.node_env == 'development') {
    return new ethers.providers.JsonRpcProvider(config.hh_node_url);
  }
  return new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
}

const getDeployerWallet = ({ config }) => () => {
  const provider = create_ethers_provider(config);
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = ({ config }) => async (publicId) => {
  const provider = create_ethers_provider(config);
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  const walletRepr = await WalletDB.create({
    publicId: publicId,
    address: wallet.address,
    privateKey: wallet.privateKey
  });
  const result = {
    publicId: walletRepr.publicId,
    address: walletRepr.address,
    privateKey: walletRepr.privateKey
  };
  return result;
};

const getWalletsData = () => async () => {
  const allWallets = await WalletDB.findAll();
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

const getWalletData = ( {config} ) => async (id) => {
  const walletRepr = await WalletDB.findByPk(id);

  const provider = create_ethers_provider(config);
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

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config })
});
