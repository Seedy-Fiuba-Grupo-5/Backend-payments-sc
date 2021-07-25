const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/getWalletHandler");
const { schema } = require("../schemas/getWalletSchema");

function route() {
  return {
    method: "GET",
    url: "/wallets/:publicId",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
