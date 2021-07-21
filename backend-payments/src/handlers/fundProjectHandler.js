const { log } = require('../log');
const service = require('../services/fundProjectService');
const helper = require('../helpers/fundProjectHelper');

function handler() {
  return async function (req, reply) {
    const data = helper.parse(req);
    log(`POST /projects/${data.projectPublicId}/funds`);
    const result = await service.process(data);
    let [statusCode, body] = helper.format(result);
    reply.code(statusCode).send(body);
  };
}

module.exports = { handler };
