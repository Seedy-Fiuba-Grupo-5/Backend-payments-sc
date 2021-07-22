const { TransactionDB } = require("../models/transaction");
const { db } = require("../db");

async function create(dataDict) {
  return await TransactionDB.create(dataDict);
}

async function get(id) {
  const t = await db.transaction();
  try {
    transactionRepr = await TransactionDB.findByPk(
      id,
      { transaction: t }
    );
    t.commit();
    return transactionRepr;
  } catch (error) {
    t.rollback();
    throw error;
  }
}

async function update(id, updatesDict) {
  const t = await db.transaction();
  try {
    await TransactionDB.update(
      updatesDict,
      {
        where: { id: id },
        transaction: t
      });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

module.exports = {
  create,
  get,
  update
}
