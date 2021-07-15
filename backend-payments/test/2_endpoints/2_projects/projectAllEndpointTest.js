'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

// Auxiliary
const { serverURL, requestHeaders, deleteDB, postNewWallet } = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /projects: ', () => {
  let url = serverURL();
  let route = '/projects';

  beforeEach(async function() {
    headers = requestHeaders();
    headersPayload = requestHeaders(true);
    await deleteDB(chai);
  });

	it('POST should create a new project from an owner wallet, ' +
      'a reviewer wallet, a stages cost list and a public id ' +
      'of a previously created project', async () => {
    publicUserId = 0;
    const ownerRes = await postNewWallet(chai, publicUserId++);
    const reviewerRes = await postNewWallet(chai, publicUserId++);
    const ownerPublicId = ownerRes.body['publicId'];
    const reviewerPublicId = reviewerRes.body['publicId'];
    const stagesCost = [2, 1, 3];
    const publicId = 1;
    const payload = {
      "ownerPublicId": ownerPublicId,
      "reviewerPublicId": reviewerPublicId,
      "stagesCost": stagesCost,
      "publicId": publicId
    };
		res = await chai.request(url)
                    .post(route)
                    .set(headersPayload)
                    .send(payload);
    expect(res).to.have.status(202);
    expect(res.body).to.have.property('ownerPublicId').to.be.eql(ownerPublicId);
    expect(res.body).to.have.property('reviewerPublicId').to.be.eql(reviewerPublicId);
    expect(res.body).to.have.property('stagesCost').to.be.eql(stagesCost);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.oneOf(['mining', 'done']);
	});

  it( 'POST should leave a new project in a "building" status when ' +
      'the reviewer wallet public id is not specified', async () => {
    const publicUserId = 0;
    const ownerRes = await postNewWallet(chai, publicUserId);
    const publicId = 1;
    const ownerPublicId = ownerRes.body['publicId'];
    const reviewerPublicId = null;
    const stagesCost = [2, 1, 3];
    const payload = {
      "publicId": publicId,
      "ownerPublicId": ownerPublicId,
      "reviewerPublicId": reviewerPublicId,
      "stagesCost": stagesCost,
    };

    res = await chai.request(url)
                    .post(route)
                    .set(headersPayload)
                    .send(payload);

    expect(res).to.have.status(202);
    expect(res.body).to.have.property('ownerPublicId').to.be.eql(ownerPublicId);
    expect(res.body).to.have.property('reviewerPublicId').to.be.eql(reviewerPublicId);
    expect(res.body).to.have.property('stagesCost').to.be.eql(stagesCost);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.eql('building');
  });
});


