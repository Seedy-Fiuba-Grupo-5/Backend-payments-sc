const { preHandler } = require("../handlers/authPreHandler");
const recreateDB = require("../handlers/recreateDBHandler");

function route() {
  return {
    method: "DELETE",
    url: "/db",
    schema: recreateDB.schema(),
    preHandler: preHandler,
    handler: recreateDB.handler(),
  };
}

module.exports = { route }