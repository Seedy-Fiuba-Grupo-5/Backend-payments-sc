const plugin = require('fastify-bearer-auth');
const { apiKey } = require("../config");

function plugIn(app) {
  app.register(plugin, {
    keys: [apiKey],
    contentType: undefined,
    bearerType: 'Bearer',
    errorResponse: (err) => {
      return {error: err.message}
    },
    auth: undefined,
    addHook: false
  });
}

module.exports = { plugIn };
