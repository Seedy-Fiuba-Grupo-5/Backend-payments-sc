const { log } = require('../log');
const { mineAProject } = require('./helpers/helpers');

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

function handler({ contractInteraction, walletService, projectService }) {
  return async function (req, reply) {
    log(`POST /projects`);
    const publicId = req.body.publicId;
    const stagesCost = req.body.stagesCost;
    const ownerPublicId = req.body.ownerPublicId;
    const reviewerPublicId = req.body.reviewerPublicId;
    
    log(`Building project ${publicId}`);
    projectRepr = await projectService.createProject(stagesCost, ownerPublicId,
                                                          reviewerPublicId, publicId);

    projectRepr = await mineAProject(projectService, walletService, contractInteraction, publicId);
    body = projectRepr;
    reply.code(202).send(body);
  };
}

module.exports = { schema, handler };
