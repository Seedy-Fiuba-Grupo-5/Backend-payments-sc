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
    auth: auth,
    addHook: false
  });
}

function auth(key, req) {
  unlockedURLs = ['/', '/./static/index.html'];
  console.log(req.url);
  if (unlockedURLs.includes(req.url)) {
    console.log('COooool');
    return true;
  }
  return key === apiKey;
}

module.exports = { plugIn };
