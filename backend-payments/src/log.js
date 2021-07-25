function log(message) {
  fullMessage = `[PAYMENTS] ${message}`;
  console.log(fullMessage);
}

module.exports = {
  log
}