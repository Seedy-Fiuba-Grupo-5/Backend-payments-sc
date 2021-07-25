const { TransactionDB } = require("../models/transactionModel");
const { db } = require("../db");
const { log } = require("../../log");

function transactionDBLog(message) {
  fullMessage = `TransactionDB: ${message}`;
  log(fullMessage);
}

async function create(dataDict) {
  transactionDBLog(`Creating transaction with next data:`);
  console.log(dataDict);
  inst = await TransactionDB.create(dataDict);
  console.log(inst);
  return inst;
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
  transactionDBLog(`Updating transaction of id: ${id}`+
                    `\n\twith next data:`);
  console.log(updatesDict);
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

async function find(queryDict) {
  const t = await db.transaction();
  try {
    someTransactionsRepr = await TransactionDB.findAll(
      {
        where: queryDict,
        transaction: t
      }
      );
    await t.commit();
    return someTransactionsRepr;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

module.exports = {
  create,
  get,
  update,
  find
}
