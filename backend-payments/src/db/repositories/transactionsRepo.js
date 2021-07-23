const { TransactionDB } = require("../models/transaction");
const { db } = require("../db");
const { log } = require("../../log");

function transactionDBLog(message) {
  fullMessage = `TransactionDB: ${message}`;
  log(fullMessage);
}

async function create(dataDict) {
  transactionDBLog(`Creating transaction with next data:`);
  console.log(dataDict);
  return await TransactionDB.create(dataDict);
}

async function get(id) {
  transactionDBLog(`Getting transaction of id: ${id}`);
  const t = await db.transaction();
  try {
    transactionRepr = await TransactionDB.findByPk(
      id,
      { transaction: t }
    );
    t.commit();
    if (transactionRepr != null) {
      console.log(transactionRepr.dataValues);
    }
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
