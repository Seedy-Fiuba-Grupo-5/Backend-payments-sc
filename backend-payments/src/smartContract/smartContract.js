const ethers = require("ethers");
const { contractAddress, contractAbi } = require("../config");

async function getContract(wallet) {
  return new ethers.Contract(contractAddress, contractAbi, wallet);
};

module.exports = { getContract };

