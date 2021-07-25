const getProjectHelper = require('../helpers/getProjectHelper');
const getProjectService = require('../services/getProjectService');
const { log } = require('../log');

function getProjectLog(message) {
  fullMessage = `Get project: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (req, reply) {
    const data = getProjectHelper.parse(req);
    log(`GET /projects/${data.publicId}`);
    getProjectLog('Parse data');
    console.log(data);
    const result = await getProjectService.process(data);
    getProjectLog('Result:');
    console.log(result);
    const [statusCode, body] = getProjectHelper.format(result);
    getProjectLog(`Response: \n\tstatus code: ${statusCode}`);
    console.log('\tbody:');
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
