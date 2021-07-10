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
    payload = {
      "ownerId": ownerRes.body['id'],
      "reviewerId": reviewerRes.body['id'],
      "stagesCost": stagesCost
    };
		res = await chai.request(url)
                    .post(parcialRoute)
                    .set('content-type', 'application/json')
                    .send(payload);
    hash = res.body['hash']
    route = `${parcialRoute}/${hash}`;

		res = await chai.request(url).get(route);
    const status_code = res.status;
    expect(status_code).to.be.oneOf([200, 204]);
    if (status_code == 204) {
      return;
    }
    console.log('Its 200 !')
    expect(res.body).to.have.property('projectId').to.be.a(integer);
    expect(res.body).to.have.property('projectOwnerAddress').to.be.eql( ownerRes.body.address );
    expect(res.body).to.have.property('projectReviewerAddress').to.be.eql( reviewerRes.body.address );
    expect(res.body).to.have.property('stagesCost').to.be.eql( stagesCost );
	});
});
