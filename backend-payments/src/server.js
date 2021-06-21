const app = require("./app")();

// Run the server!
const start = async () => {
  try {
    await app.listen(5002, '0.0.0.0');
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
