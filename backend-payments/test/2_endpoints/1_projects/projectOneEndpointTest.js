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

	it('GET should return project data if transaction was mined', async function () {
    const ownerRes = await chai.request(url).post(walletRoute);
    const reviewerRes = await chai.request(url).post(walletRoute);
    const ownerId = ownerRes.body['id'];
    const reviewerId = reviewerRes.body['id'];
    const stagesCost = [2, 1, 3];
    const publicId = 1;
    const projectOwnerAddress = ownerRes.body['address'];
    const projectReviewerAddress = reviewerRes.body['address'];
    payload = {
      "ownerId": ownerId,
      "reviewerId": reviewerId,
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

    let creationStatus = res.body['creationStatus'];
    while (creationStatus === 'mining') {
      this.timeout(1000);
      res = await chai.request(url).get(route);
      creationStatus = res.body['creationStatus'];
    }

    expect(res.status).to.be.eql(200);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.eql('done');
    expect(res.body).to.have.property('projectOwnerAddress').to.be.eql(projectOwnerAddress);
    expect(res.body).to.have.property('projectReviewerAddress').to.be.eql(projectReviewerAddress);
    expect(res.body).to.have.property('balance').to.be.eql('0.0');
    expect(res.body).to.have.property('stagesCost').to.be.eql(stagesCost);
  });
});
