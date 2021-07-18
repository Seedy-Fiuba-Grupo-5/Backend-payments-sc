const { db } = require("../db");
const Sequelize = require('sequelize')

const ProjectDB = db.define('project',{
  publicId: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false},
  privateId: {type: Sequelize.INTEGER, allowNull: true},
  creationStatus: {type: Sequelize.STRING(256), allowNull: false},
  stagesCost: {type: Sequelize.ARRAY(Sequelize.INTEGER), allowNull: true},
  ownerPublicId: {type: Sequelize.INTEGER, allowNull: true},
  reviewerPublicId: {type: Sequelize.INTEGER, allowNull: true},
  balance: {type: Sequelize.STRING(256), allowNull: true},

});

module.exports = { ProjectDB }
