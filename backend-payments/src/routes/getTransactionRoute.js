const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/getTransactionHandler");
const { schema } = require("../schemas/getTransactionSchema");

function route() {
  return {
    method: "GET",
    url: "/transactions/:transactionId",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route };
