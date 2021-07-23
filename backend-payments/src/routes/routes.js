const recreateDB = require("./recreateDBRoute");
const getWalletData = require("./getWalletRoute");
const getAllWalletsData = require("./getAllWalletsRoute");
const createWallet = require("./createWalletRoute");
const createProject = require("./createProjectRoute");
const getProject = require("./getProjectRoute");
const updateProject = require("./updateProjectRoute");
const fundProject = require("./fundProjectRoute");
const getTransaction = require("./getTransaction")

module.exports = [
  recreateDB.route,
  getWalletData.route,
  getAllWalletsData.route,
  createWallet.route,
  createProject.route,
  getProject.route,
  updateProject.route,
  fundProject.route,
  getTransaction.route
];
