const { db } = require("../db");
const { WalletDB } = require("../models/wallet");

async function createWalletDB(dataDict) {
  walletRepr = await WalletDB.create(dataDict);
  return walletRepr;
}

async function getWalletDB(publicId) {
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

async function getAllWalletsDB() {
  const t = await db.transaction();
  try {
    allWallets = await WalletDB.findAll(
      { transaction: t }
    );
    t.commit();
    return allWallets;
  } catch (error) {
    t.rollback();
    throw error;
  }
}

module.exports = {
  createWalletDB,
  getAllWalletsDB,
  getWalletDB
};