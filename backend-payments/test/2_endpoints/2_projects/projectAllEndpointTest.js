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
    headers_payload = requestHeaders(true);
    await deleteDB(chai);
  });

	it('POST should create a new project from an owner wallet, ' +
      'a reviewer wallet, a stages cost list and a public id ' +
      'of a previously created project', async () => {
    publicUserId = 0;
    const ownerRes = await postNewWallet(chai, publicUserId++);
    const reviewerRes = await postNewWallet(chai, publicUserId++);
    const ownerId = ownerRes.body['publicId'];
    const reviewerId = reviewerRes.body['publicId'];
    const stagesCost = [2, 1, 3];
    const publicId = 1;
    const payload = {
      "ownerId": ownerId,
      "reviewerId": reviewerId,
      "stagesCost": stagesCost,
      "publicId": publicId
    };
		res = await chai.request(url)
                    .post(route)
                    .set(headers_payload)
                    .send(payload);
    expect(res).to.have.status(202);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.oneOf(['mining', 'done']);
	});
});


