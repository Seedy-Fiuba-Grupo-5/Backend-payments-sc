const BigNumber = require("bignumber.js");
const ethers = require("ethers");
const { updateProject } = require("../db/repositories/projectsRepo");

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const toWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const createProject = ({ config }) => async (
  deployerWallet,
  stagesCost,
  projectOwnerAddress,
  projectReviewerAddress,
  publicId
) => {
  const seedyFiubaContract = await getContract(config, deployerWallet);
  const tx = await seedyFiubaContract.createProject(
                    stagesCost.map(toWei),
                    projectOwnerAddress,
                    projectReviewerAddress);
  await updateProject(publicId, {creationStatus: 'mining'});
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
      updateProject(publicId, updatesDict);
    } else {
      console.error(`Project not created in tx ${tx.hash}`);
    }
  });
};

module.exports = dependencies => ({
  createProject: createProject(dependencies)
});
