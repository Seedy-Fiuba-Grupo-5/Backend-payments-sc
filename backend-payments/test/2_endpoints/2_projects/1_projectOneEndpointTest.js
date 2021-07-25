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
  postNewProject,
  getProject,
  postManyNewWallets,
  patchProject
} = require('../aux');

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
    const publicId = 1;
    const [ownerRes, reviewerRes] = await postManyNewWallets(chai, 2);
    const ownerPublicId = ownerRes.body['publicId'];
    const reviewerPublicId = reviewerRes.body['publicId'];
    const stagesCost = [2, 1, 3];
    const payload = {
      "publicId": publicId,
      "ownerPublicId": ownerPublicId,
      "reviewerPublicId": reviewerPublicId,
      "stagesCost": stagesCost
    };
    await postNewProject(chai, payload);

    const route = `${parcialRoute}/${publicId}`;

    // This example shows how to GET a project
    res = await chai.request(url)
                    .get(route)
                    .set(headers);
    expect(res.status).to.be.eql(200);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.oneOf(['mining', 'done']);

    let creationStatus = res.body['creationStatus'];
    while (creationStatus === 'mining') {
      this.timeout(1000);
      // This is a shortcut to the request described above
      res = await getProject(chai, publicId)
      creationStatus = res.body['creationStatus'];
    }

    expect(res.status).to.be.eql(200);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('privateId').to.be.a('number');
    expect(res.body).to.have.property('creationStatus').to.be.eql('done');
    expect(res.body).to.have.property('stagesCost').to.be.eql(stagesCost.map((i)=>i.toString()));
    expect(res.body).to.have.property('ownerPublicId').to.be.eql(ownerPublicId);
    expect(res.body).to.have.property('reviewerPublicId').to.be.eql(reviewerPublicId);
    expect(res.body).to.have.property('balance').to.be.eql('0.0');
    expect(res.body).to.have.property('state').to.be.eql('FUNDING');
  });

  it('PATCH should return 404 if the project does not exists', async function () {
    const publicId = 999999;
    const route = `${parcialRoute}/${publicId}`;
    const payload = {
      'reviewerPublicId': 1
    }

    // This requests show how to PATCH a project with a reviewer id
    await chai.request(url)
      .patch(route)
      .set(headersPayload)
      .send(payload)
      .catch( function(err) {
        expect(err.status).to.be.eql(404);
        expect(err.response.body).to.have.property('status')
          .to.be.eql('The project or the reviewer\'s wallet requested could not be found');
      });
  });

  it('PATCH should return 202 a reviewer id is asigned for the first time', async function () {
    const publicId = 1;
    const [ownerRes, reviewerRes] = await postManyNewWallets(chai, 2);
    const ownerPublicId = ownerRes.body['publicId'];
    const stagesCost = [2, 1, 3];
    var payload = {
      "publicId": publicId,
      "ownerPublicId": ownerPublicId,
      "reviewerPublicId": -1,
      "stagesCost": stagesCost
    };
    await postNewProject(chai, payload);

    const reviewerPublicId = reviewerRes.body['publicId'];
    payload = {
      "reviewerPublicId": reviewerPublicId
    };
    var res = await patchProject(chai, publicId, payload);

    expect(res.status).to.be.eql(202);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('creationStatus').to.be.oneOf(['mining', 'done']);

    var creationStatus = res.body['creationStatus'];
    while (creationStatus === 'mining') {
      this.timeout(1000);
      res = await getProject(chai, publicId);
      creationStatus = res.body['creationStatus'];
    }

    expect(res.status).to.be.eql(200);
    expect(res.body).to.have.property('publicId').to.be.eql(publicId);
    expect(res.body).to.have.property('privateId').to.be.a('number');
    expect(res.body).to.have.property('creationStatus').to.be.eql('done');
    expect(res.body).to.have.property('stagesCost').to.be.eql(stagesCost.map((i)=>i.toString()));
    expect(res.body).to.have.property('ownerPublicId').to.be.eql(ownerPublicId);
    expect(res.body).to.have.property('reviewerPublicId').to.be.eql(reviewerPublicId);
    expect(res.body).to.have.property('balance').to.be.eql('0.0');
    expect(res.body).to.have.property('state').to.be.eql('FUNDING');
  });

  // it( 'PATCH should return 404 when trying asign a reviewer id that does not have an associated wallet' +
  //     'when the project creation status is not "building"', async function () {
  //   const publicId = 1;
  //   let [ownerRes, aReviewerRes, otherReviewerRes] = postManyNewWallets(chai, 3);
  //   const ownerPublicId = ownerRes.body['publicId'];
  //   const reviewerPublicId = aReviewerRes.body['publicId'];
  //   const stagesCost = [2, 1, 3];
  //   var payload = {
  //     "publicId": publicId,
  //     "ownerPublicId": ownerPublicId,
  //     "reviewerPublicId": reviewerPublicId,
  //     "stagesCost": stagesCost
  //   };
  //   await postNewProject(chai, payload);

  //   const route = `${parcialRoute}/${publicId}`;

  //   otherReviewerPublicId = otherReviewerRes.body['publicId'];
  //   payload = {
  //     "reviewerPublicId": otherReviewerPublicId
  //   };
  //   var res = await chai.request(url)
  //                       .patch(route)
  //                       .set(headersPayload)
  //                       .send(payload);
  //   expect(res.status).to.be.eql(202);
  //   expect(res.body).to.have.property('publicId').to.be.eql(publicId);
  //   expect(res.body).to.have.property('creationStatus').to.be.oneOf(['mining', 'done']);

  //   var creationStatus = res.body['creationStatus'];
  //   while (creationStatus === 'mining') {
  //     this.timeout(1000);
  //     res = await getProject(chai, publicId);
  //     creationStatus = res.body['creationStatus'];
  //   }

  //   expect(res.status).to.be.eql(200);
  //   expect(res.body).to.have.property('publicId').to.be.eql(publicId);
  //   expect(res.body).to.have.property('privateId').to.be.a('number');
  //   expect(res.body).to.have.property('creationStatus').to.be.eql('done');
  //   expect(res.body).to.have.property('stagesCost').to.be.eql(stagesCost);
  //   expect(res.body).to.have.property('ownerPublicId').to.be.eql(ownerPublicId);
  //   expect(res.body).to.have.property('reviewerPublicId').to.be.eql(reviewerPublicId);
  //   expect(res.body).to.have.property('balance').to.be.eql('0.0');
  // });

  // Comment this and the DB will keep its last state
  after(async function() {
    // Clean DB
    await deleteDB(chai);
  });
});
