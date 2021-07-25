const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/getSomeTransactionsHandler");
const { schema } = require("../schemas/getSomeTransactionsShema");

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
