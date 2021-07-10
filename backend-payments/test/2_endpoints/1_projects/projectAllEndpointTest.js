'use stricts'

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

const config = require('../../../src/config')

describe('Endpoint /projects: ', () => {
  let url = `http://0.0.0.0:${config.web_port}`;
  let route = '/projects';
  let walletRoute = '/wallets';

  beforeEach(async function() {
    await chai.request(url).delete('/db');
  });

	it('POST should create a new project from an owner wallet, ' +
      'a reviewer wallet and a stages cost list', async () => {
    ownerRes = await chai.request(url).post(walletRoute);
    reviewerRes = await chai.request(url).post(walletRoute);
    stagesCost = [2, 1, 3];
    payload = {
      "ownerId": ownerRes.body['id'],
      "reviewerId": reviewerRes.body['id'],
      "stagesCost": stagesCost
    };
		res = await chai.request(url)
                    .post(route)
                    .set('content-type', 'application/json')
                    .send(payload);
    expect(res).to.have.status(202);
    expect(res.body).to.have.property('hash').to.be.a('string');
	});
});


