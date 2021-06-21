require("dotenv").config();
const ethers = require("ethers");

const node_env = process.env.NODE_ENV;
temp_network = '';
if (node_env == 'development') {
  temp_network = 'localhost';
} else {
  temp_network = 'kovan'
}
const network = temp_network;
const deployArtifact = require(`../deployments/${network}/Seedifyuba`);
const deployerMnemonic = process.env.MNEMONIC;
const infuraApiKey = process.env.INFURA_API_KEY;
const hh_node_local_url = 'http://172.31.0.2:8545'
// Should use ipv4_address set in docker-compose.yml

console.log(deployerMnemonic);
module.exports = {
  contractAddress: deployArtifact.address,
  contractAbi: deployArtifact.abi,
  deployerMnemonic,
  infuraApiKey,
  network,
  node_env,
  hh_node_local_url
};

