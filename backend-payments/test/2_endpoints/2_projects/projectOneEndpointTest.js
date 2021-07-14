'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

// Auxiliary
const { serverURL, requestHeaders, deleteDB, postNewWallet } = require('../aux');

describe('Endpoint /projects/<id>: ',()=>{
  let url = serverURL();
  let parcialRoute = '/projects';

  beforeEach(async function() {
    headers = requestHeaders();
    await deleteDB(chai);
  });

	it('GET should return project data if transaction was mined', async function () {
    publicUserId = 0;
    const ownerRes = await postNewWallet(chai, publicUserId++);
    const reviewerRes = await postNewWallet(chai, publicUserId++);
    const ownerId = ownerRes.body['publicId'];
    const reviewerId = reviewerRes.body['publicId'];
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
    headers["content-type"] = 'application/json';
    res = await chai.request(url)
      .post(parcialRoute)
      .set(headers)
      .send(payload);
    route = `${parcialRoute}/${publicId}`;

    res = await chai.request(url).get(route).set(headers);
    expect(res.status).to.be.eql(200);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.oneOf(['mining', 'done']);

    let creationStatus = res.body['creationStatus'];
    while (creationStatus === 'mining') {
      this.timeout(1000);
      res = await chai.request(url).get(route).set(headers);
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
