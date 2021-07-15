'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

// Auxiliary
const { serverURL, requestHeaders, deleteDB, postNewWallet } = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /projects/<id>: ',()=>{
  let url = serverURL();
  let parcialRoute = '/projects';

  beforeEach(async function() {
    headers = requestHeaders();
    headersPayload = requestHeaders(true);
    await deleteDB(chai);
  });

	it('GET should return project data if transaction was mined', async function () {
    publicUserId = 0;
    const ownerRes = await postNewWallet(chai, publicUserId++);
    const reviewerRes = await postNewWallet(chai, publicUserId++);
    const ownerPublicId = ownerRes.body['publicId'];
    const reviewerPublicId = reviewerRes.body['publicId'];
    const stagesCost = [2, 1, 3];
    const publicId = 1;
    payload = {
      "ownerPublicId": ownerPublicId,
      "reviewerPublicId": reviewerPublicId,
      "stagesCost": stagesCost,
      "publicId": publicId
    };
    res = await chai.request(url)
                    .post(parcialRoute)
                    .set(headersPayload)
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
    expect(res.body).to.have.property('privateId').to.be.a('number');
    expect(res.body).to.have.property('creationStatus').to.be.eql('done');
    expect(res.body).to.have.property('stagesCost').to.be.eql(stagesCost);
    expect(res.body).to.have.property('ownerPublicId').to.be.eql(ownerPublicId);
    expect(res.body).to.have.property('reviewerPublicId').to.be.eql(reviewerPublicId);
    expect(res.body).to.have.property('balance').to.be.eql('0.0');
  });

  it('PATCH should return 404 if the project does not exists', async function () {
    const publicId = 999999;
    const route = `${parcialRoute}/${publicId}`;
    const payload = {
      'reviewerId': 1
    }

    await chai.request(url)
      .patch(route)
      .set(headersPayload)
      .send(payload)
      .catch( function(err) {
        expect(err.status).to.be.eql(404);
        expect(err.response.body).to.have.property('status')
          .to.be.eql('The project requested could not be found');
      });
  });
});
