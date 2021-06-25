db = require('../services/db')

function schema() {
  return {
    params: {
      type: "object",
      properties: {},
    }
  };
}

function handler() {
  return async function (req, reply) {
    while (db.accounts.length > 0) {
      db.accounts.pop();
    }
    reply.code(204);
  };
}

module.exports = { handler, schema };
