const projectsRepo = require('../db/repositories/projectsRepo');
const walletsRepo = require('../db/repositories/walletsRepo');
const walletsEther = require('../ethers/wallets');
const sc = require('../ethers/contractInteraction');
const { log } = require('../log');

async function process(publicId) {
  projectRepr = await projectsRepo.get(publicId);
  const creationStatus = projectRepr.dataValues.creationStatus;
  const reviewerPublicId = projectRepr.dataValues.reviewerPublicId;
  if ((creationStatus === 'building') && (reviewerPublicId >= 0)) {
    log(`Mining project`);
    const ownerPublicId = projectRepr.dataValues.ownerPublicId;
    const stagesCost = projectRepr.dataValues.stagesCost;

    const ownerWalletRepr = await walletsRepo.get(ownerPublicId);
    const reviewerWalletRepr = await walletsRepo.get(reviewerPublicId);
    
    const ownerWalletAddress = ownerWalletRepr.dataValues.address;
    const reviewerAdressRepr = reviewerWalletRepr.dataValues.address;

    const deployerWallet = walletsEther.getDeployerWallet();
    await sc.createProject(deployerWallet, 
                            stagesCost,
                            ownerWalletAddress,
                            reviewerAdressRepr,
                            publicId);
  }
}

module.exports = { process }
