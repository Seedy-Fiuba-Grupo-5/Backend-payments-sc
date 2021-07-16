const { log } = require('../log');

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
    log(`POST /wallets`);
    const body = await walletService.createWallet(req.body.publicId);
    return reply.code(201).send(body);
  };
}

module.exports = { handler, schema };
