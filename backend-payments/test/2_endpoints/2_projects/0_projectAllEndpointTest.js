'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

// Auxiliary
const {
  serverURL,
  requestHeaders,
  deleteDB,
  postNewWallet,
  postManyNewWallets
} = require('../aux');

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
                    .send(JSON.stringify(payload));
    expect(res).to.have.status(202);
    expect(res.body).to.have.property('ownerPublicId').to.be.eql(ownerPublicId);
    expect(res.body).to.have.property('reviewerPublicId').to.be.eql(reviewerPublicId);
    expect(res.body).to.have.property('stagesCost').to.be.eql(stagesCost.map((i)=>i.toString()));
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.oneOf(['mining', 'done']);
    expect(res.body).to.have.property('state').to.be.oneOf(['INITIALIZING', 'FUNDING']);
    stagesStates = stagesCost.map(() => false);
    expect(res.body).to.have.property('stagesStates').to.be.eql(stagesStates);
	});

  it( 'POST should leave a new project in a "building" status when ' +
      'the reviewer wallet public id is not specified', async () => {
    const publicUserId = 0;
    const ownerRes = await postNewWallet(chai, publicUserId);
    const publicId = 1;
    const ownerPublicId = ownerRes.body['publicId'];
    const reviewerPublicId = -1;
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
    expect(res.body).to.have.property('stagesCost').to.be.eql(stagesCost.map((i)=>i.toString()));
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.eql('building');
    expect(res.body).to.have.property('state').to.be.eql('INITIALIZING');
    stagesStates = stagesCost.map(() => false);
    expect(res.body).to.have.property('stagesStates').to.be.eql(stagesStates);
  });

  it('POST should return an error when the owner wallet '+
      'does not exists', async () => {
    let [reviewerRes] = await postManyNewWallets(chai, 1);
    const reviewerPublicId = reviewerRes.body['publicId'];
    const stagesCost = [2, 1, 3];
    const publicId = 1;
    const payload = {
      "ownerPublicId": 9999,
      "reviewerPublicId": reviewerPublicId,
      "stagesCost": stagesCost,
      "publicId": publicId
    };
		res = await chai.request(url)
                    .post(route)
                    .set(headersPayload)
                    .send(JSON.stringify(payload))
                    .catch(function(err){
                      expect(err).to.have.status(404);
                      expect(err.response.body).to.have.property('status');
                    });
    expect(res).to.be.eql(undefined);
	});

  // Comment this and the DB will keep its last state
  after(async function() {
    // Clean DB
    await deleteDB(chai);
  });
});
