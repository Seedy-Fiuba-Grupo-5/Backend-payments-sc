const { db } = require("../db/db");
const { nodeENV } = require("../config");
const { log } = require('../log');

function handler() {
  return async function (req, reply) {
    log(`DELETE /db`);
    if(nodeENV === 'development'){
      log(`Recreating database`);
      await db.sync({ force: true });
      reply.code(204);
      return;
    }
    log(`NOT Recreating database`);
    reply.code(405);
  };
}

module.exports = { handler };
