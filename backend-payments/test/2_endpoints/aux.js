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

async function deleteDB(chai) {
  console.log("[TEST] RECREATE DB");
  url = serverURL();
  route = '/db';
  headers = requestHeaders();
  await chai.request(url)
            .delete(route)
            .set(headers);
}

async function postNewWallet(chai, publicId) {
  console.log("[TEST] POST NEW WALLET");
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

async function postNewProject(chai, payload) {
  console.log("[TEST] POST NEW PROJECT");
  const url = serverURL();
  const route = "/projects";
  const headers = requestHeaders(true);
  const res = await chai.request(url)
                        .post(route)
                        .set(headers)
                        .send(payload)
  return res
}

async function getProject(chai, publicId) {
  console.log("[TEST] GET PROJECT");
  const url = serverURL();
  const route = `/projects/${publicId}`;
  const headers = requestHeaders();
  const res = await chai.request(url)
                        .get(route)
                        .set(headers)
  return res
}

module.exports = {
  serverURL,
  requestHeaders,
  deleteDB,
  postNewWallet,
  postNewProject,
  getProject
}
