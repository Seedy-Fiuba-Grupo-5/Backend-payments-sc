const getWalletData = require("./handlers/getWalletHandler");
const getWalletsData = require("./handlers/getWalletsHandler");
const createWallet = require("./handlers/createWalletHandler");
const createProject = require("./handlers/createProjectHandler");
const getProject = require("./handlers/getProjectHandler");
const recreateDB = require("./handlers/recreateDBHandler");

function getWalletDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets/:id",
    schema: getWalletData.schema(config),
    handler: getWalletData.handler({ config, ...services }),
  };
}

function getWalletsDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallets",
    schema: getWalletsData.schema(config),
    handler: getWalletsData.handler({ config, ...services }),
  };
}

function createWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallets",
    schema: createWallet.schema(config),
    handler: createWallet.handler({ config, ...services }),
  };
}

function createProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/projects",
    schema: createProject.schema(config),
    handler: createProject.handler({ config, ...services }),
  };
}

function getProjectRoute({ services, config }) {
  return {
    method: "GET",
    url: "/projects/:id",
    schema: getProject.schema(config),
    handler: getProject.handler({ config, ...services }),
  };
}

function recreateDBRoute({ services, config }) {
  return {
    method: "DELETE",
    url: "/db",
    schema: recreateDB.schema(config),
    handler: recreateDB.handler({ config, ...services }),
  };
}

module.exports = [getWalletDataRoute, getWalletsDataRoute, createWalletRoute,
                  createProjectRoute, getProjectRoute, recreateDBRoute];
