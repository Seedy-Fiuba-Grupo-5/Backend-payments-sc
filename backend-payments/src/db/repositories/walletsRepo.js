const { db } = require("../db");
const { WalletDB } = require("../models/wallet");

async function create(dataDict) {
  walletRepr = await WalletDB.create(dataDict);
  return walletRepr;
}

async function get(publicId) {
  const t = await db.transaction();
  try {
    walletRepr = await WalletDB.findByPk(
      publicId,
      { transaction: t }
    );
    t.commit();
    return walletRepr;
  } catch (error) {
    t.rollback();
    throw error;
  }
}

async function getAll() {
  const t = await db.transaction();
  try {
    allWalletRepr = await WalletDB.findAll(
      { transaction: t }
    );
    t.commit();
    return allWalletRepr;
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