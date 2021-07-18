const { log } = require('../log');
const createProjectService = require('../processors/createProjectService');
const createProjectHelper = require('../helpers/createProjectHelper');

function schema() {
  return {
    params: {
      type: "object",
      properties: {
        ownerId: {
          type: "integer",
        },
        reviewerId: {
          type: "integer",
        },
        stagesCost: {
          type: "array",
          minItems: 1,
          Items: { type: "number" },
        },
      },
    },
    required: ["ownerId", "reviewerId", "stagesCost"],
  };
}

function handler() {
  return async function (req, reply) {
    log(`POST /projects`);
    const data = createProjectHelper.parse(req);
    const result = await createProjectService.process(data);
    let [statusCode, body] = createProjectHelper.format(result);
    reply.code(statusCode).send(body);
  };
}

module.exports = { schema, handler };
