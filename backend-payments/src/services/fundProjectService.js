const { log } = require("../log");
const walletsRepo = require('../db/repositories/walletsRepo');
const projectsRepo = require("../db/repositories/projectsRepo");
const transactionsRepo = require("../db/repositories/transactionsRepo");
const { fund } = require('../smartContract/fundSmartContract');
const { ethersToWeis } = require("../ethers/utilsEthers");

async function process(data) {
  projectInst = await projectsRepo.get(data.projectPublicId);
  if (!projectInst) {
    log('Project not found');
    return { transactionState: 'PROJECT_NOT_FOUND'};
  }

  if (projectInst.state !== 'Funding') {
    log('Project not in FUNDING state');
    return { transactionState: 'NOT_FUNDING'};
  }

  walletInst = await walletsRepo.get(data.userPublicId);
  if (walletInst == null) {
    log('Funder wallet not found');
    return { transactionState: 'FUNDER_NOT_FOUND' };
  }

  try {
    ethersToWeis(data.amountEthers);
  } catch(error) {
    log('Invalid amount of ethers');
    return { transactionState: 'INVALID_AMOUNT_ETHERS' };
  }

  log(`Funding project ${data.projectPublicId}`);
  const dataDict = {
    amountEthers: data.amountEthers,
    fromPublicId: data.userPublicId,
    fromType: 'user',
    toPublicId: data.projectPublicId,
    toType: 'project',
    transactionType: 'fund',
    transactionState: 'Building'
  };
  transactionInst = await transactionsRepo.create(dataDict);
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
