'use stricts'

const config = require('../src/config')
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = `http://0.0.0.0:${config.web_port}`;


describe('Endpoint /wallet: ',()=>{
  let route = '/wallet'
	it('GET should return an empty list when there are not wallets created', (done) => {
		chai.request(url)
			.get(route)
			.end( function (err, res) {
				expect(res).to.have.status(200);
        expect(res.body).to.eql([])
				done();
			});
	});
});
