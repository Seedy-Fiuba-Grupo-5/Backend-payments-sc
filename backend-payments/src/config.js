require("dotenv").config();

const node_env = process.env.NODE_ENV;
temp_network = 'kovan';
if (node_env == 'development') {
  temp_network = 'localhost';
}
const network = temp_network;
const deployArtifact = require(`../deployments/${network}/Seedifyuba`);
const deployerMnemonic = process.env.MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;
const hh_node_url = process.env.SC_HH_NODE_URL;
const web_port = process.env.PORT;

module.exports = {
  contractAddress: deployArtifact.address,
  contractAbi: deployArtifact.abi,
  deployerMnemonic,
  infuraApiKey,
  network,
  node_env,
  hh_node_url,
  web_port
};

