const getTransactionHelper = require('../helpers/getSomeTransactionsHelper');
const getTransactionsService = require('../services/getSomeTransactionsService');
const { log } = require('../log');

function getSomeTransactionsLog(message) {
  fullMessage = `Get some transactions: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (req, reply) {
    log(`GET /transactions`);
    const data = getTransactionHelper.parse(req);
    getSomeTransactionsLog('Parsed data:');
    console.log(data);
    const result = await getTransactionsService.process(data.query);
    getSomeTransactionsLog('Result:');
    console.log(result);
    const [statusCode, body] = getTransactionHelper.format(result);
    getSomeTransactionsLog(`Response: \n\tstatus code: ${statusCode}`);
    console.log('\tbody:');
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
