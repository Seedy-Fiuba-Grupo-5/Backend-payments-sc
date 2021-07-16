const { db } = require("../db/db");
const { node_env } = require("../config");
const { log } = require('../log');

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
    log(`DELETE /db`);
    if(node_env === 'development'){
      log(`Recreating database`);
      await db.sync({ force: true });
      reply.code(204);
      return;
    }
    log(`Not recreation database`);
    reply.code(405);
  };
}

module.exports = { handler, schema };
