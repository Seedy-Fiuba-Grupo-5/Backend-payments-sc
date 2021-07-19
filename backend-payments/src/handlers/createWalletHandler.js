const createWalletHelper = require('../helpers/createWalletHelper');
const createWalletService = require('../services/createWalletService');
const { log } = require('../log');

function handler() {
  return async function (req, reply) {
    log(`POST /wallets`);
    const data = createWalletHelper.parse(req);
    const result = await createWalletService.process(data);
    const [statusCode, body] = createWalletHelper.format(result);
    return reply.code(statusCode).send(body);
  };
}

module.exports = { handler };
