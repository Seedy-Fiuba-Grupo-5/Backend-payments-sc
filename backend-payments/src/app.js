'use strict'

const config = require("./config");
const services = require("./services/services")({ config });
const routes = require("./routes");
const fastify = require("fastify");
// const fastifyPostgres = require("fastify-postgres");

// Declares routes
function build() {
  // Create app
  const app = fastify({ logger: true })

  // Register postgres DB
  // app.register(fastifyPostgres, {
  //   connectionString: config.databaseURL
  // });

  // Add routes
  routes.forEach(route => app.route(route({ config, services })));

  return app
}

module.exports = build
