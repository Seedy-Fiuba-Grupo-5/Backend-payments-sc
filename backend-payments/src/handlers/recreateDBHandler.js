const { db } = require("../db/db");
const {node_env} = require("../config");

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
    if(node_env === 'development'){
      await db.sync({ force: true });
      reply.code(204);
      return;
    }
    reply.code(405);
  };
}

module.exports = { handler, schema };
