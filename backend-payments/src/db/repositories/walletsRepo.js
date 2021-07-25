const { WalletDB } = require("../models/walletModel");
const { db } = require("../db");
const { log } = require("../../log");

async function walletDBLog(message) {
  fullMessage = `WalletDB: ${message}`;
  log(fullMessage);
}

async function create(dataDict) {
  walletDBLog('Creating wallet with next data:');
  console.log(dataDict);
  walletInst = await WalletDB.create(dataDict);
  console.log(walletInst);
  return walletInst;
}

async function get(publicId) {
  walletDBLog(`Getting wallet of public id: ${publicId}`);
  const t = await db.transaction();
  try {
    walletInst = await WalletDB.findByPk(
      publicId,
      { transaction: t }
    );
    t.commit();
    if (walletInst !== null) {
      console.log(walletInst);
    }
    return walletInst;
  } catch (error) {
    t.rollback();
    throw error;
  }
}

async function getAll() {
  walletDBLog(`Getting all wallets`);
  const t = await db.transaction();
  try {
    allWalletInst = await WalletDB.findAll(
      { transaction: t }
    );
    t.commit();
    return allWalletInst;
  } catch (error) {
    t.rollback();
    throw error;
  }
}

module.exports = {
  get,
  getAll,
  create
};
