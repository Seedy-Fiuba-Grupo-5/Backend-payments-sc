const recreateDB = require("../handlers/recreateDBHandler");

function route() {
  return {
    method: "DELETE",
    url: "/db",
    schema: recreateDB.schema(),
    handler: recreateDB.handler(),
  };
}

module.exports = { route }