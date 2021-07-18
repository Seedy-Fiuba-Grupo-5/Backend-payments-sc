const { log } = require('../log');
const { patchProjectParse, patchProjectFormat } = require('../helpers/patchProjectHelper');
const { patchProjectProcess } = require('../processors/patchProjectProcess');

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
    const data = patchProjectParse(req);
    log(`PATCH /projects/${data.publicId}`);
    const result = await patchProjectProcess(data);
    let [statusCode, body] = patchProjectFormat(result);
    reply.code(statusCode).send(body);
  };
}

module.exports = { schema, handler };
