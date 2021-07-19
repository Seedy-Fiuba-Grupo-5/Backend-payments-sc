const { preHandler } = require("../handlers/authPreHandler");
const { handler } = require("../handlers/recreateDBHandler");
const { schema } = require("../schemas/recreateDBSchema");

function route() {
  return {
    method: "DELETE",
    url: "/db",
    schema: schema(),
    preHandler: preHandler,
    handler: handler(),
  };
}

module.exports = { route }