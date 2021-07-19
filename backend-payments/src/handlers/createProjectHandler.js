const { log } = require('../log');
const createProjectService = require('../services/createProjectService');
const createProjectHelper = require('../helpers/createProjectHelper');

function handler() {
  return async function (req, reply) {
    log(`POST /projects`);
    const data = createProjectHelper.parse(req);
    const result = await createProjectService.process(data);
    let [statusCode, body] = createProjectHelper.format(result);
    reply.code(statusCode).send(body);
  };
}

module.exports = { handler };
