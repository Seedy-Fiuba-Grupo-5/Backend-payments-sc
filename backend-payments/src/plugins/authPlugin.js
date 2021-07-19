const plugin = require('fastify-auth');

async function plugIn(app) {
  await app.register(plugin);
}

module.exports = { plugIn };
