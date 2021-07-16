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

function handler({ projectService }) {
  return async function (req, reply) {
    const publicId = req.params.id
    log(`GET /projects/${publicId}`);
    const body = await projectService.getProject(publicId);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
