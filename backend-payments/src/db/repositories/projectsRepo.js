const { ProjectDB } = require("../models/projectModel");
const { db } = require("../db");
const utils = require('../../ethers/utilsEthers');
const { log } = require("../../log");

INITIALIZING = 'INITIALIZING';
FUNDING = 'Funding';
IN_PROGRESS = 'In progress';
COMPLETED = 'Completed';

function projectDBLog(message) {
  fullMessage = `ProjectDB: ${message}`;
  log(fullMessage);
}

async function create(dataDict) {
  projectDBLog(`Creating project with next data:`);
  console.log(dataDict);
  inst = await ProjectDB.create(dataDict);
  console.log(inst);
  return inst;
}

async function get(publicId) {
  projectDBLog(`Getting project of publicId: ${publicId}`);
  const t = await db.transaction();
  try {
    projectRepr = await ProjectDB.findByPk(
      publicId,
      { transaction: t }
    );
    t.commit();
    if (projectRepr != null) {
      console.log(projectRepr.dataValues);
    }
    return projectRepr;
  } catch (error) {
    t.rollback();
    throw error;
  }
}

async function update(publicId, updatesDict) {
  projectDBLog(`Updating project of publicId: ${publicId}`+
                `\n\twith next data:`);
  console.log(updatesDict);
  const t = await db.transaction();
  try {
    await ProjectDB.update(
      updatesDict,
      {
        where: { publicId: publicId },
        transaction: t
      });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function addBalance(publicId, amountEthers) {
  projectDBLog(`Adding to project of publicId: ${publicId}`+
                `\n\tan amount of ethers equal to: ${amountEthers}`);
  const t = await db.transaction();
  try {
    projectRepr = await ProjectDB.findByPk(publicId);
    balanceEthers = projectRepr.dataValues.balance;
    newBalanceEthers = utils.sumEthers(balanceEthers, amountEthers);
    await ProjectDB.update(
      { balance: newBalanceEthers },
      {
        where: { publicId: publicId },
        transaction: t
      });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

async function setCompletedStage(publicId, stageIndex) {
  stageNumber = stageIndex + 1;
  projectDBLog(`Updating project of publicId: ${publicId}`+
              `\n\tsetting stages completed up to: ${stageNumber}`);
  const t = await db.transaction();
  try {
    projectRepr = await ProjectDB.findByPk(publicId);
    newStagesStates = projectRepr.dataValues.stagesCost.map((_,i) => i < stageNumber);
    await ProjectDB.update(
      { stagesStates: newStagesStates },
      {
        where: { publicId: publicId },
        transaction: t
      });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
}


module.exports = {
  INITIALIZING,
  FUNDING,
  IN_PROGRESS,
  COMPLETED,
  get,
  create,
  update,
  addBalance,
  setCompletedStage
};
