const { log } = require('../log');
const { createProjectProcess } = require('../processors/createProjectProcess');
const { createProjectParse, createProjectFormat } = require('../helpers/createProjectHelper');

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
    const data = createProjectParse(req);
    const result = await createProjectProcess(data);
    let [statusCode, body] = createProjectFormat(result);
    reply.code(statusCode).send(body);
  };
}

module.exports = { schema, handler };
