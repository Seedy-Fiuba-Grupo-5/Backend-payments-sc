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

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    ownerWallet = await walletService.getWalletData(req.body.ownerId);
    reviewerWallet = await walletService.getWalletData(req.body.reviewerId);
    const body = await contractInteraction.createProject(
                    walletService.getDeployerWallet(),
                    req.body.stagesCost,
                    ownerWallet.address,
                    reviewerWallet.address,
                  );
    reply.code(201).send(body);
  };
}

module.exports = { schema, handler };
