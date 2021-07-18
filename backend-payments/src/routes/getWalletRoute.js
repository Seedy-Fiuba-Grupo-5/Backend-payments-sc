const getWallet = require("../handlers/getWalletHandler");

function route() {
  return {
    method: "GET",
    url: "/wallets/:publicId",
    schema: getWallet.schema(),
    handler: getWallet.handler(),
  };
}

module.exports = { route };
