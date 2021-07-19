const { preHandler } = require("../handlers/authPreHandler");
const getWallet = require("../handlers/getWalletHandler");

function route() {
  return {
    method: "GET",
    url: "/wallets/:publicId",
    schema: getWallet.schema(),
    preHandler: preHandler,
    handler: getWallet.handler(),
  };
}

module.exports = { route };
