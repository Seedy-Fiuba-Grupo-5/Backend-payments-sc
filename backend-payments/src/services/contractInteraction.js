const BigNumber = require("bignumber.js");
const ethers = require("ethers");
const {ProjectDB} = require("../db/models/project")

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const toWei = number => {
  const WEIS_IN_ETHER = BigNumber(10).pow(18);
  return BigNumber(number).times(WEIS_IN_ETHER).toFixed();
};

const projects = {};

const createProject = ({ config }) => async (
  deployerWallet,
  stagesCost,
  projectOwnerAddress,
  projectReviewerAddress,
  publicId,
) => {
  const seedyFiubaContract = await getContract(config, deployerWallet);
  const tx = await seedyFiubaContract.createProject(
                    stagesCost.map(toWei),
                    projectOwnerAddress,
                    projectReviewerAddress);
  const projectRepr = await ProjectDB.create({
    "publicId": publicId,
    "creationStatus": "mining",
    "balance": null,
    "projectReviewerAddress": null,
    "projectOwnerAddress": null,
    "stagesCost": null,
    "privateId": null
  })

  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    console.log(firstEvent);
    if (firstEvent && firstEvent.event === "ProjectCreated") {
      const projectId = firstEvent.args.projectId.toNumber();
      projectRepr.privateId = projectId;
      projectRepr.stagesCost = stagesCost;
      projectRepr.projectOwnerAddress = projectOwnerAddress;
      projectRepr.projectReviewerAddress = projectReviewerAddress;
      projectRepr.balance = '0';
      projectRepr.creationStatus = 'done';
      projectRepr.save();
    } else {
      console.error(`Project not created in tx ${tx.hash}`);
    }
  });
  return projectRepr;
};

const getProject = () => async id => {
  return await ProjectDB.findByPk(id);
};

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
});
