const getAllWallets = require("../handlers/getWalletsHandler");

function route() {
  return {
    method: "GET",
    url: "/wallets",
    schema: getAllWallets.schema(),
    handler: getAllWallets.handler(),
  };
}

module.exports = { route };
