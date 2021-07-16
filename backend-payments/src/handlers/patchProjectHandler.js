const { log } = require('../log');
const { mineAProject } = require('./helpers/helpers');

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
    const publicId = parseInt(req.params.publicId);
    log(`PATCH /projects/${publicId}`);
    projectRepr = await projectService.getProject(publicId);
    if (projectRepr === null) {
      log(`Project not found`);
      body = {
        "status": "The project requested could not be found"
      }
      reply.code(404).send(body);
      return;
    }
    log(`Project found`);
    await projectService.addReviewer(publicId);
    projectRepr = await mineAProject(projectService, walletService, contractInteraction, publicId);
    body = projectRepr;
    reply.code(202).send(body);
    return;
  };
}

module.exports = { schema, handler };
