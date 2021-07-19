const { preHandler } = require('../handlers/authPreHandler');
const { handler } = require("../handlers/getWalletsHandler");
const { schema } = require('../schemas/getAllWalletsSchema');

function route() {
  return {
    method: "GET",
    url: "/wallets",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
