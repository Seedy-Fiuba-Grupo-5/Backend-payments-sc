const BigNumber = require("bignumber.js");
const ethers = require("ethers");
const { ProjectDB } = require("../db/models/project")

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
  projectRepr = await ProjectDB.findByPk(publicId);
  projectRepr.creationStatus = 'mining';
  await projectRepr.save();
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event === "ProjectCreated") {
      const projectId = firstEvent.args.projectId.toNumber();
      projectRepr.privateId = projectId;
      projectRepr.balance = '0.0';
      projectRepr.creationStatus = 'done';
      projectRepr.save();
    } else {
      console.error(`Project not created in tx ${tx.hash}`);
    }
  });
  return projectRepr;
};

module.exports = dependencies => ({
  createProject: createProject(dependencies)
});
