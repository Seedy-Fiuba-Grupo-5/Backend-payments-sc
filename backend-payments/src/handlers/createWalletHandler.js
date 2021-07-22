const createWalletHelper = require('../helpers/createWalletHelper');
const createWalletService = require('../services/createWalletService');
const { log } = require('../log');

function createWalletLog(message) {
  fullMessage = `Create Wallet: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (req, reply) {
    log(`POST /wallets`);
    const data = createWalletHelper.parse(req);
    createWalletLog('Parsed data:');
    console.log(data);
    const result = await createWalletService.process(data);
    createWalletLog('Result:');
    console.log(result);
    let [statusCode, body] = createWalletHelper.format(result);
    createWalletLog(`Response: \n\tstatus code: ${statusCode}`);
    console.log('\tbody:');
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
