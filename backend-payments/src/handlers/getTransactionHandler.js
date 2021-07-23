const getTransactionHelper = require('../helpers/getTransactionHelper');
const getTransactionService = require('../services/getTransactionService');
const { log } = require('../log');

function handler() {
  return async function (req, reply) {
    const data = getTransactionHelper.parse(req);
    log(`GET /transactions/${data.transactionId}`);
    const result = await getTransactionService.process(data);
    const [statusCode, body] = getTransactionHelper.format(result);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
