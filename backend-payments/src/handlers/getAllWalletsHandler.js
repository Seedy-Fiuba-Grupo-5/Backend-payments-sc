const getAllWalletsHelper = require('../helpers/getAllWalletsHelper');
const getAllWalletsService = require('../services/getAllWalletsService');
const { log } = require('../log');

function getAllWalletsLog(message) {
  fullMessage = `Get all wallets: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (req, reply) {
    log(`GET /wallets`);
    const data = getAllWalletsHelper.parse(req);
    getAllWalletsLog('Parsed data');
    console.log(data);
    const result = await getAllWalletsService.process(data);
    getAllWalletsLog('Result:');
    console.log(result);
    const [statusCode, body] = getAllWalletsHelper.format(result);
    getAllWalletsLog(`Response: \n\tstatus code: ${statusCode}`);
    console.log('\tbody:');
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
