'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

// Auxiliary
const config = require('../../../src/config')

describe('Endpoint /projects/<id>: ',()=>{
  let url = `http://0.0.0.0:${config.web_port}`;
  let parcialRoute = '/projects';
  let walletRoute = '/wallets';

  beforeEach(async function() {
    await chai.request(url).delete('/db');
  });

	it('GET should return project data if transaction was mined', async () => {
    ownerRes = await chai.request(url).post(walletRoute);
    reviewerRes = await chai.request(url).post(walletRoute);
    stagesCost = [2, 1, 3];
    const publicId = 1;
    payload = {
      "ownerId": ownerRes.body['id'],
      "reviewerId": reviewerRes.body['id'],
      "stagesCost": stagesCost,
      "publicId": publicId
    };
		res = await chai.request(url)
                    .post(parcialRoute)
                    .set('content-type', 'application/json')
                    .send(payload);
    route = `${parcialRoute}/${publicId}`;

		res = await chai.request(url).get(route);
    expect(res.status).to.be.eql(200);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.oneOf(['mining', 'done']);
	});
});
