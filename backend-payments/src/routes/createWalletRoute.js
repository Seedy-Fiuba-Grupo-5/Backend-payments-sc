const createWallet = require("../handlers/createWalletHandler");

function route() {
  return {
    method: "POST",
    url: "/wallets",
    schema: createWallet.schema(),
    handler: createWallet.handler(),
  };
}

module.exports = { route };
