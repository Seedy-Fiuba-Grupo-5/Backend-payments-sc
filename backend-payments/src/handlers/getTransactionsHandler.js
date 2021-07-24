const getTransactionHelper = require('../helpers/getTransactionsHelper');
const getTransactionsService = require('../services/getTransactionsService');
const { log } = require('../log');

function handler() {
  return async function (req, reply) {
    const data = getTransactionHelper.parse(req);
    console.log(data.query)
    log(`GET /transactions`);
    const result = await getTransactionsService.process(data.query);
    const [statusCode, body] = getTransactionHelper.format(result);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
