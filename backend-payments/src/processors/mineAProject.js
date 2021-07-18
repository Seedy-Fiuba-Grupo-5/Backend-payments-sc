const { log } = require('../log');
const { getProjectDB } = require('../db/repositories/projectsRepo');
const { createProjectSC } = require('../ethers/contractInteraction');
const { getWalletData, getDeployerWallet } = require('../ethers/wallets');

async function mineAProject(publicId) {
  projectRepr = await getProjectDB(publicId);
  const creationStatus = projectRepr.dataValues.creationStatus;
  const reviewerPublicId = projectRepr.dataValues.reviewerPublicId;
  if ((creationStatus === 'building') && (reviewerPublicId != null)) {
    log(`Mining project`);
    const ownerPublicId = projectRepr.dataValues.ownerPublicId;
    const stagesCost = projectRepr.dataValues.stagesCost;
    const ownerWallet = await getWalletData(ownerPublicId);
    const reviewerWallet = await getWalletData(reviewerPublicId);
    const deployerWallet = getDeployerWallet();
    await createProjectSC(deployerWallet, 
                          stagesCost,
                          ownerWallet.address,
                          reviewerWallet.address,
                          publicId);
  }
}

module.exports = {
  mineAProject
}
