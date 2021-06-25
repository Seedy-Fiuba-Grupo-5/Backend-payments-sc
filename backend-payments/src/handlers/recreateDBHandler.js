function schema() {
  return {
    params: {
      type: "object",
      properties: {},
    }
  };
}

function handler({ accounts }) {
  return async function (req, reply) {
    accounts = [];
    reply.code(204);
  };
}

module.exports = { handler, schema };
