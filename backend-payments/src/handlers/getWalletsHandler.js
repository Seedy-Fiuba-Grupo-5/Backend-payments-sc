const getAllWalletsHelper = require('../helpers/getAllWalletsHelper');
const getAllWalletsService = require('../services/getAllWalletsService');
const { log } = require('../log');

function handler() {
  return async function (req, reply) {
    log(`GET /wallets`);
    const data = getAllWalletsHelper.parse(req);
    const result = await getAllWalletsService.process(data);
    const [statusCode, body] = getAllWalletsHelper.format(result);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
