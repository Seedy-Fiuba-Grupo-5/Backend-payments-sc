const { apiKey, web_port } = require('../../src/config');

function serverURL(){
  url = `http://0.0.0.0:${web_port}`;
  return url;
}

function requestHeaders(payload=false) {
  headers = {
    "Authorization": `Bearer ${apiKey}`
  };
  if (payload) {
    headers['content-type'] = 'application/json';
  }
  return headers
}

async function postNewWallet(chai, publicId) {
  const url = serverURL();
  const route = "/wallets";
  const headers = requestHeaders(true);
  const payload = { "publicId": publicId };
  res = await chai.request(url)
                  .post(route)
                  .set(headers)
                  .send(payload);
  return res;
}

async function deleteDB(chai) {
  url = serverURL();
  route = '/db';
  headers = requestHeaders();
  await chai.request(url)
            .delete(route)
            .set(headers);
}

module.exports = {
  serverURL,
  requestHeaders,
  deleteDB,
  postNewWallet
}
