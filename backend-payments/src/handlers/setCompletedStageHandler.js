const { log } = require('../log');
const service = require('../services/setCompletedStageService');
const helper = require('../helpers/setCompletedStageHelper');

function setCompletedStageLog(message) {
  fullMessage = `Set stage completed: ${message}`;
  log(fullMessage);
}

function handler() {
  return async function (req, reply) {
    const data = helper.parse(req);
    setCompletedStageLog(`POST /projects/${data.projectPublicId}/stages/`);
    setCompletedStageLog('Parsed data:'+
                          `\n\treviewerPublicId: ${data.reviewerPublicId}`+
                          `\n\tstageNumber: ${data.stageNumber}`);
    const result = await service.process(data);
    setCompletedStageLog('Result:');
    console.log(result);
    let [statusCode, body] = helper.format(result);
    setCompletedStageLog(`Response: \n\t status code: ${statusCode} `);
    console.log(`\tbody: `);
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
