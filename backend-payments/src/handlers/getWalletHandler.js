const getWalletHelper = require('../helpers/getWalletHelper');
const getWalletService = require('../services/getWalletService');
const { log } = require('../log');

function getWalletLog(message) {
  fullMessage = `Get wallet: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (req, reply) {
    const data = getWalletHelper.parse(req);
    log(`GET /wallets/${data.publicId}`);
    getWalletLog('Parsed data:');
    console.log(data);
    const result = await getWalletService.process(data);
    getWalletLog('Result:');
    console.log(result);
    const [statusCode, body] = getWalletHelper.format(result);
    getWalletLog(`Response: \n\tstatus code: ${statusCode}`);
    console.log('\tbody');
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
