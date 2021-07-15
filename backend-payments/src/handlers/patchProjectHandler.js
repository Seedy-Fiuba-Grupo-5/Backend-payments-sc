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

function handler({ contractInteraction, walletService, projectService }) {
  return async function (req, reply) {
    const publicId = req.params.publicId;
    projectRepr = await projectService.getProject(publicId);
    if (projectRepr === null) {
      body = {
        "status": "The project requested could not be found"
      }
      reply.code(404).send(body);
      return;
    }

    reply.code(500);
    return;
  };
}

module.exports = { schema, handler };
