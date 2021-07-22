const walletsRepo = require('../db/repositories/walletsRepo');
const projectsRepo = require("../db/repositories/projectsRepo");
const transactionRepo = require("../db/repositories/transactionsRepo");
const { fund } = require('../ethers/fundSmartContract');
const { log } = require("../log");

async function process(data) {
  log(`Funding project ${data.projectPublicId}`);
  const dataDict = {
    amountEthers: data.amountEthers,
    fromPublicId: data.userPublicId,
    fromType: 'user',
    toPublicId: data.projectPublicId,
    toType: 'project',
    transactionType: 'fund',
    transactionState: 'building'
  };
  transactionRepr = await transactionRepo.create(dataDict);
  projectRepr = await projectsRepo.get(data.projectPublicId);
  walletRepr = await walletsRepo.get(data.userPublicId);
  await fund(
    data.amountEthers,
    walletRepr.dataValues.privateKey,
    projectRepr.dataValues.privateId,
    transactionRepr.id,
    data.projectPublicId
    );
  transactionRepr = await transactionRepo.get(transactionRepr.id);
  return transactionRepr;
}

module.exports = { process };
