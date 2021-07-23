const ethers = require("ethers");
const {
  apiKey,
  webPort,
  hhNodeURL,
  deployerMnemonic
} = require('../../src/config');

// Utils

function serverURL(){
  url = `http://0.0.0.0:${webPort}`;
  return url;
}

function requestHeaders(payload=false) {
  headers = {
    "Authorization": `Bearer ${apiKey}`
  };
  if (payload) {
    headers['content-type'] = 'application/json';
  }
  return headers;
}

function weisToEthers(weis) {
  bigNumberWeis = ethers.BigNumber.from(weis);
  return ethers.utils.formatEther(bigNumberWeis);
}

function getProvider() {
  return new ethers.providers.JsonRpcProvider(hhNodeURL);
}

function getTestWallet() {
  const provider = getProvider();
  return ethers.Wallet.fromMnemonic(deployerMnemonic).connect(provider);
}

async function addWeis(address, weis) {
  testWallet = getTestWallet();
  tx = { to: address, value: weis};
  await testWallet.sendTransaction(tx);
}

async function sleep(miliseconds) {
  console.log(`[TEST] SLEEP ${miliseconds} MILISECONDS`);
  await new Promise(resolve => setTimeout(resolve, miliseconds));
}

// Server interaction

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

var publicUserId = 0
async function postManyNewWallets(chai, quantity) {
  var walletsList = []
  for (; walletsList.length < quantity;) {
    walletRes = await postNewWallet(chai, publicUserId++);
    walletsList.push(walletRes);
  }
  return walletsList;
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
  return res;
}

async function getProject(chai, publicId) {
  console.log("[TEST] GET PROJECT");
  const url = serverURL();
  const route = `/projects/${publicId}`;
  const headers = requestHeaders();
  const res = await chai.request(url)
                        .get(route)
                        .set(headers)
  return res;
}

async function patchProject(chai, publicId, payload) {
  console.log("[TEST] PATCH PROJECT");
  const url = serverURL();
  const route = `/projects/${publicId}`;
  const headers = requestHeaders(true);
  const res = await chai.request(url)
                        .patch(route)
                        .set(headers)
                        .send(payload);
  return res;
}

async function createFundingProject(chai, payload) {
  console.log(`[TEST] CREATE PROJECT IN FUNDING STATE`);
  res = await postNewProject(chai, payload);
  const publicId = res.body['publicId'];
  while (res.body['creationStatus'] != 'done') {
    await sleep(1000);
    res = await getProject(chai, publicId);
  }
  return res;
}

async function fundProject(chai, payload, projectPublicId) {
  console.log(`[TEST] FUND PROJECT`);
  const url = serverURL();
  const route = `/projects/${projectPublicId}/funds`;
  const headers = requestHeaders(true);
  res = await chai.request(url)
                    .post(route)
                    .set(headers)
                    .send(payload)
                    .catch(function(err) {
                      console.log('[TEST] Error while funding');
                      throw err;
                    });
  return res;
}

async function createInProgressProject(chai, projectPayload, funderRes) {
  fundingProjectRes = await createFundingProject(chai, payload);
  projectPublicId = fundingProjectRes.body['publicId'];
  url = serverURL();
  route = `/projects/${projectPublicId}/funds`;
  headers = requestHeaders(true);
  totalEthers = projectPayload.stagesCost.reduce(
    (x,y) => { return (parseFloat(x) + parseFloat(y)).toString() });
  funderPayload = {
    "userPublicId": funderRes.body['publicId'],
    "amountEthers": totalEthers
  };
  await fundProject(chai, funderPayload, projectPublicId);
  let res;
  do {
    await sleep(1000);
    res = await getProject(chai, projectPublicId);
  } while (res.body['state'] != 'IN_PROGRESS');
  return res;
}


module.exports = {
  serverURL,
  requestHeaders,
  deleteDB,
  postNewWallet,
  postNewProject,
  getProject,
  postManyNewWallets,
  patchProject,
  createFundingProject,
  createInProgressProject,
  weisToEthers,
  addWeis
}
