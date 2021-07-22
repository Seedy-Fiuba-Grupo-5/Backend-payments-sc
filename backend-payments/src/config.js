require("dotenv").config();

const nodeENV = process.env.NODE_ENV;
temp_network = 'kovan';
if (nodeENV === 'development') {
  temp_network = 'localhost';
}
const network = temp_network;
const deployArtifact = require(`../deployments/${network}/Seedifyuba`);
const deployerMnemonic = process.env.MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;
const hhNodeURL = process.env.SC_HH_NODE_URL || '';
const webPort = process.env.PORT;
const databaseURL = process.env.DATABASE_URL;
const gatewayURL = process.env.GATEWAY_URL;
const apiKey = process.env.API_KEY;

module.exports = {
  contractAddress: deployArtifact.address,
  contractAbi: deployArtifact.abi,
  deployerMnemonic,
  infuraApiKey,
  network,
  nodeENV,
  hhNodeURL,
  webPort,
  databaseURL,
  gatewayURL,
  apiKey
};

