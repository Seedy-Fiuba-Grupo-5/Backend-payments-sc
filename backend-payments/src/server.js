const config = require("./config");
const app = require("./app")();

console.log(config.deployerMnemonic);

// Run the server!
const start = async () => {
  try {
    await app.listen(config.web_port, '0.0.0.0');
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
