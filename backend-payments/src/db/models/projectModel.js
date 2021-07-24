const { db } = require("../db");
const Sequelize = require('sequelize')

const ProjectDB = db.define('project',{
  publicId: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false},
  privateId: {type: Sequelize.INTEGER, allowNull: true},
  creationStatus: {type: Sequelize.STRING(256), allowNull: false},
  stagesCost: {type: Sequelize.ARRAY(Sequelize.STRING(256)), allowNull: true},
  stagesStates: {type: Sequelize.ARRAY(Sequelize.BOOLEAN)},
  ownerPublicId: {type: Sequelize.INTEGER, allowNull: true},
  reviewerPublicId: {type: Sequelize.INTEGER, allowNull: true},
  balance: {type: Sequelize.STRING(256), allowNull: true},
  state: {type: Sequelize.STRING(256)}
});

module.exports = { ProjectDB }
