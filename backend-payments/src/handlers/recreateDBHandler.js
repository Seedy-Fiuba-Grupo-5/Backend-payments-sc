const { db } = require("../db/db");
const { nodeENV } = require("../config");
const { log } = require('../log');

function recreateDBLog(message) {
  fullMessage = `Recreate DB: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (_req, reply) {
    log(`DELETE /db`);
    if(nodeENV === 'development'){
      recreateDBLog(`Work in progress ...`);
      await db.sync({ force: true });
      reply.code(204);
      return;
    }
    recreateDBLog(`Disable => Failed`);
    reply.code(405);
  };
}

module.exports = { handler };
