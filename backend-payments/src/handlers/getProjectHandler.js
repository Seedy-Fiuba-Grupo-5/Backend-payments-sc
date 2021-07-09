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

function handler({ contractInteraction }) {
  return async function (req, reply) {
    const body = await contractInteraction.getProject(req.params.id);
    if (! body) {
      reply.code(204);
      return;
    }
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
