const { preHandler } = require('../handlers/authPreHandler');
const getAllWallets = require("../handlers/getWalletsHandler");

function route() {
  return {
    method: "GET",
    url: "/wallets",
    schema: getAllWallets.schema(),
    preHandler: preHandler,
    handler: getAllWallets.handler(),
  };
}

module.exports = { route };
