'use stricts'

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const config = require('../../../src/config')

chai.use(chaiHttp);
const url = `http://0.0.0.0:${config.web_port}`;

describe('Endpoint /wallets: ', () => {
  beforeEach(async function() {
    await chai.request(url).delete('/db');
  });

  let route = '/wallets'
	it('GET should return an empty list when there are not wallets created', async () => {
		res = await chai.request(url).get(route)
    expect(res).to.have.status(200);
    expect(res.body).to.be.a('array');
    expect(res.body).to.have.lengthOf(0);
	});

  it('POST should create a new wallet', async () => {
		res = await chai.request(url).post(route)
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("id").to.be.a('number');
    expect(res.body).to.have.property("address").to.be.a('string');
    expect(res.body).to.have.property("privateKey").to.be.a('string');
	});

  it('GET should return a list with two wallets when two wallets were created', async () => {
    await chai.request(url).post(route)
    await chai.request(url).post(route)

		res = await chai.request(url).get(route)
    expect(res).to.have.status(200);
    expect(res.body).to.be.a('array');
    expect(res.body).to.have.lengthOf(2);
    expect(res.body[0]).to.have.property('address').to.be.a('string');
    expect(res.body[0]).to.have.property('privateKey').to.be.a('string');
	});
});


