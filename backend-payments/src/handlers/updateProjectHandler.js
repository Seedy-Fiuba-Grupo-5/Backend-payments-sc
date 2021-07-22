const updateProjectHelper = require('../helpers/updateProjectHelper');
const updateProjectService = require('../services/updateProjectService');
const { log } = require('../log');

function handler() {
  return async function (req, reply) {
    const data = updateProjectHelper.parse(req);
    log(`PATCH /projects/${data.publicId}`);
    const result = await updateProjectService.process(data);
    let [statusCode, body] = updateProjectHelper.format(result);
    reply.code(statusCode)
          .header('Content-Type', 'application/json')
          .send(body);
  };
}

module.exports = { handler };
