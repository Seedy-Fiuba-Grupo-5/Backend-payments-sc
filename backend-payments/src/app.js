'use strict'

const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");
const fastify = require("fastify");

// Declares routes
function build() {
  const app = fastify({ logger: true })
  routes.forEach(route => app.route(route({ config, services })));
  return app
}

module.exports = build
