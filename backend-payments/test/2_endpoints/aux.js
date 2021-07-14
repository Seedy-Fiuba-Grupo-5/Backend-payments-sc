const { apiKey } = require('../../src/config');

function getHeaders() {
  headers = {
    "Authorization": `Bearer ${apiKey}`
  };
  return headers
}

module.exports = {
  getHeaders
}
