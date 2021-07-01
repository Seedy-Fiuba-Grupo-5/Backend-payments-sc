function schema() {
  return {
    params: {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
      },
    },
    required: ["id"],
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const body = await walletService.createWallet();
    return reply.code(201).send(body);
  };
}

module.exports = { handler, schema };
