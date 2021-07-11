const { db } = require("../db");
const Sequelize = require('sequelize')

const ProjectDB = db.define('project',{
  publicId: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false},
  privateId: {type: Sequelize.INTEGER, allowNull: true},
  stagesCost: {type: Sequelize.ARRAY(Sequelize.INTEGER), allowNull: true},
  projectOwnerAddress: {type: Sequelize.STRING(256), allowNull: true},
  projectReviewerAddress: {type: Sequelize.STRING(256), allowNull: true},
  balance: {type: Sequelize.STRING, allowNull: true},
  creationStatus: {type: Sequelize.STRING(128), allowNull: false}
});

module.exports = { ProjectDB }
