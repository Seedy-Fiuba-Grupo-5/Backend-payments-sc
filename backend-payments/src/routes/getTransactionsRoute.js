const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/getTransactionsHandler");
const { schema } = require("../schemas/getTransactionsShema");

function route() {
  return {
    method: "GET",
    url: "/transactions",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
