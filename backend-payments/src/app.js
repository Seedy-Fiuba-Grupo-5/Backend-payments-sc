'use strict'

const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");
const fastify = require("fastify");

// Declares routes
function build() {
  // Create app
  const app = fastify({ logger: true })

  // Add routes
  routes.forEach(route => app.route(route({ config, services })));

  return app
}

module.exports = build
