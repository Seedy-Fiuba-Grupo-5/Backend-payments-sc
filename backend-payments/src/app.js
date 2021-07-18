'use strict'

const config = require("./config");
const routes = require("./routes");
const fastify = require("fastify");
const bearerAuthFastifyPlugin = require('fastify-bearer-auth');
const corsFastifyPlugin = require('fastify-cors');

function registerApiKey(app) {
  app.register(bearerAuthFastifyPlugin, {
    keys: [config.apiKey],
    contentType: undefined,
    bearerType: 'Bearer',
    errorResponse: (err) => {
      return {error: err.message}
    },
    auth: undefined,
    addHook: true
  });
}

function registerCors(app) {
  app.register(corsFastifyPlugin, {
    origin: config.gatewayURL
  });
}

function registerRoutes(app) {
  routes.forEach(route => app.route(route()));
}

function build() {
  const app = fastify({ logger: true })
  registerApiKey(app);
  registerCors(app)
  registerRoutes(app)
  return app
}

module.exports = build
