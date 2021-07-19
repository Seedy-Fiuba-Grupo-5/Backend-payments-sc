const { preHandler } = require("../handlers/authPreHandler");
const createWallet = require("../handlers/createWalletHandler");

function route() {
  return {
    method: "POST",
    url: "/wallets",
    schema: createWallet.schema(),
    preHandler: preHandler,
    handler: createWallet.handler(),
  };
}

module.exports = { route };
