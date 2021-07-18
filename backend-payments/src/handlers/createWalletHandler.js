const createWalletHelper = require('../helpers/createWalletHelper');
const createWalletService = require('../processors/createWalletService');
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
    log(`POST /wallets`);
    const data = createWalletHelper.parse(req);
    const result = await createWalletService.process(data);
    const [statusCode, body] = createWalletHelper.format(result);
    return reply.code(statusCode).send(body);
  };
}

module.exports = { handler, schema };
