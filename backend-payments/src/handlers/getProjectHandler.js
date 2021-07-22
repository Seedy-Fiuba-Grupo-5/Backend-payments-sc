const getProjectHelper = require('../helpers/getProjectHelper');
const getProjectService = require('../services/getProjectService');
const { log } = require('../log');

function handler() {
  return async function (req, reply) {
    const data = getProjectHelper.parse(req);
    log(`GET /projects/${data.publicId}`);
    const result = await getProjectService.process(data);
    const [statusCode, body] = getProjectHelper.format(result);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
