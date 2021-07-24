const updateProjectHelper = require('../helpers/updateProjectHelper');
const updateProjectService = require('../services/updateProjectService');
const { log } = require('../log');

function updateProjectLog(message) {
  fullMessage = `Update project: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (req, reply) {
    const data = updateProjectHelper.parse(req);
    log(`PATCH /projects/${data.publicId}`);
    updateProjectLog('Parsed data');
    console.log(data);
    const result = await updateProjectService.process(data);
    updateProjectLog('Result:');
    console.log(result);
    let [statusCode, body] = updateProjectHelper.format(result);
    updateProjectLog(`Response: \n\tstatus code: ${statusCode}`);
    console.log('\tbody:');
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
