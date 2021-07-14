const { apiKey, web_port } = require('../../src/config');

function getServerUrl(){
  url = `http://0.0.0.0:${web_port}`;
  return url;
}

function getHeaders(payload=false) {
  headers = {
    "Authorization": `Bearer ${apiKey}`
  };
  if (payload) {
    headers['content-type'] = 'application/json';
  }
  return headers
}

async function postNewWallet(chai, publicId) {
  const url = getServerUrl();
  const route = "/wallets";
  const headers = getHeaders(true);
  const payload = { "publicId": publicId };
  res = await chai.request(url)
                  .post(route)
                  .set(headers)
                  .send(payload);
  return res;
}

module.exports = {
  getServerUrl,
  getHeaders,
  postNewWallet
}
