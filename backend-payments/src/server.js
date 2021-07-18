const config = require("./config");
const { db } = require("./db/db");
const appBuilder = require("./app");
const app = appBuilder();

const start = async () => {
  try {
    await db.sync({alter: true});
    console.log(`[LOG] Database was syncronized.`);

    await app.listen(config.webPort, '0.0.0.0');
    app.log.info(`server listening on ${app.server.address().port}`);

  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
