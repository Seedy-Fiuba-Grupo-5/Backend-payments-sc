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
    const publicId = req.params.id
    log(`GET /wallets/${publicId}`);
    const body = await walletService.getWalletData(publicId);
    reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
