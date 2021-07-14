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
    const body = await projectService.getProject(req.params.id);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
