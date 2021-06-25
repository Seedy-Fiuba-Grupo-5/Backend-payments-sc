'use stricts'

const config = require('../src/config')
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = `http://0.0.0.0:${config.web_port}`;

describe('Endpoint /wallets: ',()=>{
  beforeEach(function() {
    chai.request(url)
      .delete('/db');
  });

  let route = '/wallets'
	it('GET should return an empty list when there are not wallets created', (done) => {
		chai.request(url)
			.get(route)
			.end( function (err, res) {
				expect(res).to.have.status(200);
        expect(res.body).to.eql([])
				done();
			});
	});

  it('POST should create a new wallet', (done) => {
		chai.request(url)
			.post(route)
			.end( function (err, res) {
				expect(res).to.have.status(200);
        expect(res.body).to.have.property("id")
        expect(res.body).to.have.property("address")
        expect(res.body).to.have.property("privateKey")
				done();
			});
	});
});
