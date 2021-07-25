const { log } = require('../log');
const service = require('../services/fundProjectService');
const helper = require('../helpers/fundProjectHelper');

function fundProjectLog(message) {
  fullMessage = `Fund project: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (req, reply) {
    const data = helper.parse(req);
    log(`POST /projects/${data.projectPublicId}/funds`);
    fundProjectLog('Parse data:');
    console.log(data);
    const result = await service.process(data);
    fundProjectLog('Result:');
    console.log(result);
    let [statusCode, body] = helper.format(result);
    fundProjectLog(`Response: \n\tstatus code: ${statusCode}`);
    console.log('\tbody:');
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
