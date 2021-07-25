const getTransactionHelper = require('../helpers/getTransactionHelper');
const getTransactionService = require('../services/getTransactionService');
const { log } = require('../log');

function getTransactionLog(message) {
  fullMessage = `Get transaction: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (req, reply) {
    const data = getTransactionHelper.parse(req);
    log(`GET /transactions/${data.transactionId}`);
    getTransactionLog('Parsed data:');
    console.log(data);
    const result = await getTransactionService.process(data);
    getTransactionLog('Result:');
    console.log(result);
    const [statusCode, body] = getTransactionHelper.format(result);
    getTransactionLog(`Response: \n\tstatus code: ${statusCode}`);
    console.log('\tbody:');
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
