const getProjectHelper = require('../helpers/getProjectHelper');
const getProjectService = require('../processors/getProjectService');
const { log } = require('../log');

function schema() {
  return {
    params: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
      },
    },
    required: ["id"],
  };
}

function handler() {
  return async function (req, reply) {
    const data = getProjectHelper.parse(req);
    log(`GET /projects/${data.publicId}`);
    const result = await getProjectService.process(data);
    const [statusCode, body] = getProjectHelper.format(result);
    return reply.code(statusCode).send(body);
  };
}

module.exports = { handler, schema };
