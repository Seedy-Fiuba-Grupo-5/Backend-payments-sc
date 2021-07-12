'use strict'

const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");
const fastify = require("fastify");

// Declares routes
function build() {
  // Create app
  const app = fastify({ logger: true })

  // Register CORS
  app.register(require('fastify-cors'), {
    origin: config.gatewayURL
  })

  // Register routes (endpoints)
  routes.forEach(route => app.route(route({ config, services })));

  return app
}

module.exports = build
