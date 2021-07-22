const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/createWalletHandler");
const { schema } = require("../schemas/createWalletSchema");


function route() {
  return {
    method: "POST",
    url: "/wallets",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
