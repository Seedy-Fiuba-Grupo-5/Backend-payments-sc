const sc = require('./smartContract');
const projectsRepo = require("../db/repositories/projectsRepo");
const { ethersToWeis } = require("../ethers/utilsEthers");
const { log } = require('../log');

async function createProject(
  deployerWallet,
  stagesCost,
  projectOwnerAddress,
  projectReviewerAddress,
  publicId
) {
  const seedyFiubaContract = await sc.getContract(deployerWallet);
  let tx;
  try {
    tx = await seedyFiubaContract.createProject(
      stagesCost.map(ethersToWeis),
      projectOwnerAddress,
      projectReviewerAddress
    );
  } catch(error) {
    log(`Project creation transaction failed:`);
    console.log(error);
    updatesDict = { creationStatus: 'failed' };
    await projectsRepo.update(publicId, updatesDict);
    return;
  }

  log('Creation project transaction in progress ...')
  await projectsRepo.update(publicId, {creationStatus: 'mining'});
  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];

    let updatesDict = null;
    if (firstEvent && firstEvent.event === "ProjectCreated") {
      console.log(firstEvent);
      const projectId = firstEvent.args.projectId.toNumber();
      const ownerAddress = firstEvent.args.owner.toString();
      const reviewerAddress = firstEvent.args.reviewer.toString();
      const totalAmountNeeded = firstEvent.args.totalAmountNeeded; // Do not convert BigNumber to Number
      log(`Event 'ProjectCreated': ` +
          `\n\tprojectId: ${projectId}` +
          `\n\townerAddress: ${ownerAddress}` +
          `\n\treviewerAddress: ${reviewerAddress}` +
          `\n\ttotalAmounNeeded: ${totalAmountNeeded} weis`
          );
      updatesDict = {
        privateId: projectId,
        balance: '0.0',
        creationStatus: 'done',
        state: projectsRepo.FUNDING
      };
    } else {
      log(`Project creation failed:\n\ttx hash: ${tx.hash}`);
      updatesDict = { creationStatus: 'failed' };
    }
    projectsRepo.update(publicId, updatesDict);
  });
};

module.exports = {
  createProject
};
