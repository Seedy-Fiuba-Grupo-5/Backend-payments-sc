const patchProjectHelper = require('../helpers/patchProjectHelper');
const patchProjectService = require('../services/patchProjectService');
const { log } = require('../log');

function schema() {
  return {
    params: {
      type: "object",
      properties: {
        reviewerId: {
          type: "integer",
        }
      },
    },
    required: ["reviewerId"],
  };
}

function handler() {
  return async function (req, reply) {
    const data = patchProjectHelper.parse(req);
    log(`PATCH /projects/${data.publicId}`);
    const result = await patchProjectService.process(data);
    let [statusCode, body] = patchProjectHelper.format(result);
    reply.code(statusCode).send(body);
  };
}

module.exports = { schema, handler };
