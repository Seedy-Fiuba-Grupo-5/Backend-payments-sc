const getAllWalletsHelper = require('../helpers/getAllWalletsHelper');
const getAllWalletsService = require('../processors/getAllWalletsService');
const { log } = require('../log');

function schema() {
  return {
    params: {},
  };
}

function handler() {
  return async function (req, reply) {
    log(`GET /wallets`);
    const data = getAllWalletsHelper.parse(req);
    const result = await getAllWalletsService.process(data);
    const [statusCode, body] = getAllWalletsHelper.format(result);
    return reply.code(statusCode).send(body);
  };
}

module.exports = { handler, schema };
