const updateProjectHelper = require('../helpers/updateProjectHelper');
const updateProjectService = require('../services/updateProjectService');
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
    const data = updateProjectHelper.parse(req);
    log(`PATCH /projects/${data.publicId}`);
    const result = await updateProjectService.process(data);
    let [statusCode, body] = updateProjectHelper.format(result);
    reply.code(statusCode).send(body);
  };
}

module.exports = { schema, handler };
