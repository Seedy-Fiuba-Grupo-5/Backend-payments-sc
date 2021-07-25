const { webPort } = require("./config");
const { db } = require("./db/db");
const fastify = require("fastify");
const corsExtension = require('./plugins/corsPlugin');
const swaggerExtension = require("./plugins/swaggerPlugin");
const routes = require("./routes/routes");

const app = fastify({ logger: true })

// Extensions
swaggerExtension.plugIn(app); // Should be call before routing
corsExtension.plugIn(app);

routes.forEach(route => app.route(route()));

db.sync({alter: true}).then(async () => {
  try {
    await app.listen(webPort, '0.0.0.0');
    app.swagger();
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
});
