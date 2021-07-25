const { log } = require("../log");
const walletsRepo = require('../db/repositories/walletsRepo');
const projectsRepo = require("../db/repositories/projectsRepo");
const transactionsRepo = require("../db/repositories/transactionsRepo");
const { fund } = require('../smartContract/fundSmartContract');

async function process(data) {
  projectInst = await projectsRepo.get(data.projectPublicId);
  if (!projectInst) {
    log('Project not found');
    return { transactionState: 'PROJECT_NOT_FOUND'};
  }
  
  if (projectInst.state !== 'FUNDING') {
    log('Project not in FUNDING state');
    return { transactionState: 'NOT_FUNDING'};
  }

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

  transactionInst = await transactionsRepo.create(dataDict);
  walletInst = await walletsRepo.get(data.userPublicId);
  await fund(
    data.amountEthers,
    walletInst.dataValues.privateKey,
    projectInst.dataValues.privateId,
    transactionInst.id,
    data.projectPublicId
    );
  transactionInst = await transactionsRepo.get(transactionInst.id);
  return transactionInst.dataValues;
}

module.exports = { process };
