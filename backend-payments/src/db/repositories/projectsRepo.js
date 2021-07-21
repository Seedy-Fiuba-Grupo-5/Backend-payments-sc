const { ProjectDB } = require("../models/project");
const { db } = require("../db");
const utils = require('../../ethers/utils');

async function create(dataDict) {
  return await ProjectDB.create(dataDict);
}

async function get(publicId) {
  const t = await db.transaction();
  try {
    projectRepr = await ProjectDB.findByPk(
      publicId,
      { transaction: t }
    );
    t.commit();
    return projectRepr;
  } catch (error) {
    t.rollback();
    throw error;
  }
}

async function update(publicId, updatesDict) {
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

async function addBalance(publicId, amountWeis) {
  const t = await db.transaction();
  try {
    projectRepr = await ProjectDB.findByPk(publicId);
    balanceEthers = projectRepr.dataValues.balance;
    amountEthers = utils.weisToEthersString(amountWeis);
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


module.exports = {
  get,
  create,
  update,
  addBalance
};