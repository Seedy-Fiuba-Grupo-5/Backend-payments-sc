const plugin = require('fastify-swagger');
const { options } = require('../schemas/options');

function plugIn(app) {
  app.register(plugin, options);
}

module.exports = { plugIn };
