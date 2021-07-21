const ethers = require("ethers");
const BigNumber = require("bignumber.js");

function weisToEthersString(weis) {
  bigNumberWeis = ethers.BigNumber.from(weis);
  return ethers.utils.formatEther(bigNumberWeis)  
}

function ethersNumToWeis(ethersNum) {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(ethersNum).times(WEIS_IN_ETHER).toFixed();
}

function sumEthers(e1, e2) {
  bigNumberWeis1 = ethers.utils.parseEther(e1);
  bigNumberWeis2 = ethers.utils.parseEther(e2);
  totalBigNumberWeis = bigNumberWeis1 + bigNumberWeis2;
  totalEthers = ethers.utils.formatEther(totalBigNumberWeis); 
  return totalEthers;
}

module.exports = { 
  weisToEthersString, 
  ethersNumToWeis,
  sumEthers 
};