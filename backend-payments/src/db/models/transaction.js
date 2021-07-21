const { db } = require("../db");
const Sequelize = require('sequelize')

const TransactionDB = db.define('transaction',{
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  amountEthers: { type: Sequelize.DECIMAL(38,20) },
  fromPublicId: { type: Sequelize.INTEGER },
  fromType: { type: Sequelize.STRING(256) },
  toPublicId: { type: Sequelize.INTEGER },
  toType: { type: Sequelize.STRING(256) },
  transactionType: { type: Sequelize.STRING(256) },
  transactionState: { type: Sequelize.STRING(256) }
});

module.exports = { TransactionDB }
