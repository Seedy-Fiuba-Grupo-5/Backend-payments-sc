const getWalletHelper = require('../helpers/getWalletHelper');
const getWalletService = require('../services/getWalletService');
const { log } = require('../log');

function schema() {
  return {
    params: {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
      },
    },
    required: ["id"],
  };
}

function handler() {
  return async function (req, reply) {
    const data = getWalletHelper.parse(req);
    log(`GET /wallets/${data.publicId}`);
    const result = await getWalletService.process(data);
    const [statusCode, body] = getWalletHelper.format(result);
    return reply.code(statusCode).send(body);
  };
}

module.exports = { handler, schema };
