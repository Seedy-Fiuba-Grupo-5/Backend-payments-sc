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
    const stagesCost = req.body.stagesCost;
    const ownerPublicId = req.body.ownerPublicId;
    const reviewerPublicId = req.body.reviewerPublicId;
    const publicId = req.body.publicId;

    projectRepr = await projectService.createProject(stagesCost, ownerPublicId,
                                                          reviewerPublicId, publicId);

    creationStatus = projectRepr.dataValues.creationStatus;
    if ((creationStatus === 'building') && (reviewerPublicId != null)) {
      const ownerWallet = await walletService.getWalletData(ownerPublicId);
      const reviewerWallet = await walletService.getWalletData(reviewerPublicId);
      const deployerWallet = walletService.getDeployerWallet();
      projectRepr = await contractInteraction.createProject(deployerWallet, stagesCost,
                                                            ownerWallet.address,
                                                            reviewerWallet.address,
                                                            publicId);
    }
    body = projectRepr;
    reply.code(202).send(body);
  };
}

module.exports = { schema, handler };
