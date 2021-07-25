'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

// Auxiliary
const ethers = require("ethers");
const config = require('../../../src/config')
const { serverURL, requestHeaders, deleteDB } = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /wallets/<id>: ',()=>{
  let url = serverURL();
  let parcialRoute = '/wallets';
  let provider = new ethers.providers.JsonRpcProvider(config.hhNodeURL);
  let testWallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic)
                                .connect(provider);

  beforeEach(async function() {
    headers = requestHeaders();
    headersPayload = requestHeaders(true);
    await deleteDB(chai);
  });

	it('GET should return a wallet without ethers when it was just created', async () => {
    const publicId = 1;
    const payload = { "publicId": publicId };
    res = await chai.request(url)
                    .post(parcialRoute)
                    .set(headersPayload)
                    .send(payload);
    route = `${parcialRoute}/${publicId}`;

		res = await chai.request(url).get(route).set(headers);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('balance').to.be.eql('0.0');
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('address').to.be.a('string');
    expect(res.body).to.have.property('privateKey').to.be.a('string');
	});

  it('GET should return a wallet with 10^(-18) ethers (1 wei) when it was just loaded with that',
      async () => {
    const publicId = 1;
    const payload = { "publicId": publicId };
    res = await chai.request(url)
                    .post(parcialRoute)
                    .set(headersPayload)
                    .send(payload);
    const route = `${parcialRoute}/${publicId}`;
    const address = res.body.address;
    const weisLoad = ethers.BigNumber.from(1);
    const tx = {to: address, value: weisLoad};

    await testWallet.sendTransaction(tx);

		res = await chai.request(url).get(route).set(headers);
    expect(res).to.have.status(200);
    const ethersLoad = ethers.utils.formatEther(weisLoad);
    expect(res.body).to.have.property('balance').to.be.eql( ethersLoad );
	});

  // Comment this and the DB will keep its last state
  after(async function() {
    // Clean DB
    await deleteDB(chai);
  });
});
