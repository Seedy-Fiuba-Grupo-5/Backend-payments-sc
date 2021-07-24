const ethers = require("ethers");

function weisToEthers(weis) {
  bigNumberWeis = ethers.BigNumber.from(weis);
  return ethers.utils.formatEther(bigNumberWeis);
}

function ethersToWeis(ethersString) {
  return ethers.utils.parseEther(ethersString).toString();
}

function sumEthers(e1, e2) {
  bigNumberWeis1 = ethers.utils.parseEther(e1);
  bigNumberWeis2 = ethers.utils.parseEther(e2);
  totalBigNumberWeis = bigNumberWeis1.add(bigNumberWeis2);
  totalEthers = ethers.utils.formatEther(totalBigNumberWeis);
  return totalEthers;
}

module.exports = {
  weisToEthers,
  ethersToWeis,
  sumEthers
};
