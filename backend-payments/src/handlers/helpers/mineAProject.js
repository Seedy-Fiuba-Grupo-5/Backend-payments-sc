const { log } = require('../../log');

async function mineAProject(projectService, walletService, contractInteraction, publicId) {
  projectRepr = await projectService.getProject(publicId);
  const creationStatus = projectRepr.dataValues.creationStatus;
  const reviewerPublicId = projectRepr.dataValues.reviewerPublicId;
  if ((creationStatus === 'building') && (reviewerPublicId != null)) {
    log(`Mining project`);
    const ownerPublicId = projectRepr.dataValues.ownerPublicId;
    const stagesCost = projectRepr.dataValues.stagesCost;
    const ownerWallet = await walletService.getWalletData(ownerPublicId);
    const reviewerWallet = await walletService.getWalletData(reviewerPublicId);
    const deployerWallet = walletService.getDeployerWallet();
    projectRepr = await contractInteraction.createProject(deployerWallet, 
                                                          stagesCost,
                                                          ownerWallet.address,
                                                          reviewerWallet.address,
                                                          publicId);
  }
  return projectRepr;
}

module.exports = {
  mineAProject
}
