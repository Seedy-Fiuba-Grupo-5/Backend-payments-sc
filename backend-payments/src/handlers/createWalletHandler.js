const { createWalletParse, createWalletFormat } = require('../helpers/createWalletHelper');
const { createWalletProcess } = require('../processors/createWalletProcess');
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

function handler() {
  return async function (req, reply) {
    log(`POST /wallets`);
    const data = createWalletParse(req);
    const result = await createWalletProcess(data);
    const [statusCode, body] = createWalletFormat(result);
    return reply.code(statusCode).send(body);
  };
}

module.exports = { handler, schema };
