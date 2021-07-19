const plugin = require('fastify-cors');
const { gatewayURL } = require("../config");

function plugIn(app) {
  app.register(plugin, {
    origin: gatewayURL
  });
}

module.exports = { plugIn };
