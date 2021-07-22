const { log } = require('../log');
const createProjectService = require('../services/createProjectService');
const createProjectHelper = require('../helpers/createProjectHelper');

function createProjectLog(message) {
  fulMessage = `Create Project: ${message}`;
  log(fulMessage);
}

function handler() {
  return async function (req, reply) {
    createProjectLog(`POST /projects`);
    const data = createProjectHelper.parse(req);
    createProjectLog('Parsed data:');
    console.log(data);
    const result = await createProjectService.process(data);
    createProjectLog('Result:');
    console.log(result);
    let [statusCode, body] = createProjectHelper.format(result);
    createProjectLog(`Response: \n\t status code: ${statusCode} `);
    console.log(`\tbody: `);
    console.log(body);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
