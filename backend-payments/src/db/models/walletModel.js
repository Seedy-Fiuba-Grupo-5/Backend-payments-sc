const { db } = require("../db");
const Sequelize = require('sequelize')

const WalletDB = db.define('wallets',{
  publicId: {type: Sequelize.INTEGER, primaryKey: true},
  address: {type: Sequelize.STRING(256), allowNull: false},
  privateKey: {type: Sequelize.STRING(256), allowNull: false}
});

module.exports = { WalletDB }
