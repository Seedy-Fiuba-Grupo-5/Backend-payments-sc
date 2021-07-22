'use stricts'

// Test suit
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

// Auxiliary
const { serverURL, requestHeaders, deleteDB } = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /wallets: ', () => {
  let url = serverURL();
  let route = '/wallets';

  beforeEach(async function() {
    headers = requestHeaders();
    await deleteDB(chai);
  });

	it('GET should return an empty list when there are not wallets created', async () => {
    res = await chai.request(url).get(route).set(headers);
    expect(res).to.have.status(200);
    expect(res.body).to.be.a('array');
    expect(res.body).to.have.lengthOf(0);
	});

  it('POST should create a new wallet', async () => {
    publicId = 1;
    payload = {
      "publicId": publicId
    };
    headers['content-type'] = 'application/json';
		res = await chai.request(url)
                    .post(route)
                    .set(headers)
                    .send(payload);
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("publicId").to.be.eql(publicId);
    expect(res.body).to.have.property("address").to.be.a('string');
    expect(res.body).to.have.property("privateKey").to.be.a('string');
	});

  it('GET should return a list with two wallets when two wallets were created', async () => {
    nWallets = 2;
    headers_post = {...headers};
    headers_post['content-type'] = 'application/json';
    for (let index = 0; index < nWallets; index++) {
      payload = { "publicId": index };
      await chai.request(url)
                .post(route)
                .set(headers_post)
                .send(payload);
    }

		res = await chai.request(url).get(route).set(headers);

    expect(res).to.have.status(200);
    expect(res.body).to.be.a('array');
    expect(res.body).to.have.lengthOf(nWallets);
    for (let index = 0; index < nWallets; index++) {
      expect(res.body[index]).to.have.property('publicId').to.be.a('number');
      expect(res.body[index]).to.have.property('address').to.be.a('string');
      expect(res.body[index]).to.have.property('privateKey').to.be.a('string');
    }
	});
});
