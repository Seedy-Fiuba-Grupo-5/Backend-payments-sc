'use stricts'

const config = require('../src/config')
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = `http://0.0.0.0:${config.web_port}`;

describe('Endpoint /wallets/<id>: ',()=>{
  beforeEach(function() {
    chai.request(url)
      .delete('/db');
  });

  let parcial_route = '/wallets'
	it('GET should return wallet data', async () => {
    res = await chai
      .request(url)
      .post(parcial_route)
    id = res.body['id']
    route = `${parcial_route}/${id}`;
		chai.request(url)
			.get(route)
			.end( function (err, res) {
				expect(res).to.have.status(200);
        expect(res.body).to.have.property('address');
        expect(res.body).to.have.property('privateKey');
			});
	});
});
