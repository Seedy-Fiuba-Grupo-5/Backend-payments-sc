const recreateDB = require("./handlers/recreateDBHandler");
const getWalletData = require("./handlers/getWalletHandler");
const getWalletsData = require("./handlers/getWalletsHandler");
const createWallet = require("./handlers/createWalletHandler");
const createProject = require("./handlers/createProjectHandler");
const getProject = require("./handlers/getProjectHandler");
const patchProject = require("./handlers/patchProjectHandler");

function getWalletDataRoute() {
  return {
    method: "GET",
    url: "/wallets/:publicId",
    schema: getWalletData.schema(),
    handler: getWalletData.handler(),
  };
}

function getWalletsDataRoute() {
  return {
    method: "GET",
    url: "/wallets",
    schema: getWalletsData.schema(),
    handler: getWalletsData.handler(),
  };
}

function createWalletRoute() {
  return {
    method: "POST",
    url: "/wallets",
    schema: createWallet.schema(),
    handler: createWallet.handler(),
  };
}

function createProjectRoute() {
  return {
    method: "POST",
    url: "/projects",
    schema: createProject.schema(),
    handler: createProject.handler(),
  };
}

function getProjectRoute() {
  return {
    method: "GET",
    url: "/projects/:publicId",
    schema: getProject.schema(),
    handler: getProject.handler(),
  };
}

function patchProjectRoute() {
  return {
    method: "PATCH",
    url: "/projects/:publicId",
    schema: patchProject.schema(),
    handler: patchProject.handler(),
  };
}

function recreateDBRoute() {
  return {
    method: "DELETE",
    url: "/db",
    schema: recreateDB.schema(),
    handler: recreateDB.handler(),
  };
}

module.exports = [
  recreateDBRoute,
  getWalletDataRoute,
  getWalletsDataRoute,
  createWalletRoute,
  createProjectRoute,
  getProjectRoute,
  patchProjectRoute
];
