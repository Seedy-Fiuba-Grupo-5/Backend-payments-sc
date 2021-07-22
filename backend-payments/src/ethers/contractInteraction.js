const BigNumber = require("bignumber.js");
const ethers = require("ethers");
const { contractAddress, contractAbi } = require("../config");
const projectsRepo = require("../db/repositories/projectsRepo");
const { ethersToWeis } = require("./utils");

async function getContract(wallet) {
  return new ethers.Contract(contractAddress, contractAbi, wallet);
};

function toWei(number) {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

async function createProject(
  deployerWallet,
  stagesCost,
  projectOwnerAddress,
  projectReviewerAddress,
  publicId
) {
  const seedyFiubaContract = await getContract(deployerWallet);
  const tx = await seedyFiubaContract.createProject(
                    stagesCost.map(ethersToWeis),
                    projectOwnerAddress,
                    projectReviewerAddress);
  await projectsRepo.update(publicId, {creationStatus: 'mining'});
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event === "ProjectCreated") {
      const projectId = firstEvent.args.projectId.toNumber();
      updatesDict = {
        privateId: projectId,
        balance: '0.0',
        creationStatus: 'done'
      };
      projectsRepo.update(publicId, updatesDict);
    } else {
      console.error(`Project not created in tx ${tx.hash}`);
    }
  });
};

module.exports = {
  createProject
};
