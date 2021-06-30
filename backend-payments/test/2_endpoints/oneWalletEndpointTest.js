'use stricts'

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const ethers = require("ethers");
const config = require('../../src/config')

chai.use(chaiHttp);
const url = `http://0.0.0.0:${config.web_port}`;

describe('Endpoint /wallets/<id>: ',()=>{
  beforeEach(async function() {
    await chai.request(url).delete('/db');
  });

  let parcialRoute = '/wallets'

	it('GET should return a wallet without ethers when it was just created', async () => {
    res = await chai.request(url).post(parcialRoute)
    id = res.body['id']
    route = `${parcialRoute}/${id}`;

		res = await chai.request(url).get(route)
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('address').to.be.a('string');
    expect(res.body).to.have.property('privateKey').to.be.a('string');
    expect(res.body).to.have.property('balance').to.be.eql('0.0');
	});
});
