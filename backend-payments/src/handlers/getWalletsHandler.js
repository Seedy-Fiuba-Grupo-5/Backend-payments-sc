const { log } = require('../log');

function schema() {
  return {
    params: {},
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    log(`GET /wallets`);
    const body = await walletService.getWalletsData();
    return reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
