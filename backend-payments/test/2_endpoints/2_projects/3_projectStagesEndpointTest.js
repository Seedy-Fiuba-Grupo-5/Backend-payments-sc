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
  postManyNewWallets,
  createInProgressProject,
  weisToEthers,
  addWeis,
  getProject,
  getWallet
} = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /projects/<id>/stages/<stage_number>: ',()=>{
  let url = serverURL();

  describe('Given a created project in IN_PROGRESS state', ()=>{
    let ownerRes, reviewerRes, funderRes;
    let projectPublicId = 1;
    let stagesCost = [weisToEthers(2), weisToEthers(1), weisToEthers(3)];
    console.log(stagesCost);

    beforeEach(async function() {
      // Timeout limit for this pre-test
      this.timeout(10000);

      // Clean DB
      await deleteDB(chai);

      // Aux headers
      headers = requestHeaders();
      headersPayload = requestHeaders(true);

      // Create FUNDING project
      [ownerRes, reviewerRes, funderRes] = await postManyNewWallets(chai, 3);
      payload = {
        "publicId": projectPublicId,
        "ownerPublicId": ownerRes.body['publicId'],
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stagesCost": stagesCost
      };
      fundWeis = 6;
      txCostWeis = 972976000000007;
      totalWeis = fundWeis + txCostWeis;
      addWeis(funderRes.body['address'], txCostWeis);
      await createInProgressProject(chai, payload, funderRes);
      route = `/projects/${projectPublicId}/stages`;
    });

    it ('The project should be IN_PROGRESS state', async function () {
      res = await getProject(chai, projectPublicId);
      expect(res.body).to.have.property('state').to.be.eql('IN_PROGRESS');
    });

    it ('The owner of the project should have the funds of the first stage of it', async function () {
      res = await getWallet(chai, ownerRes.body['publicId']);
      expect(res.body).to.have.property('balance').to.be.eql(stagesCost[0]);
    });

  //   it( 'The reviewer of the project, should be able to set the second stage as complete '+
  //       'if it has enough ethers to make this transaction', async function () {
  //     costTxWeis = 1;
  //     await addWeis(reviewerRes.body['address'], costTxWeis);
  //     route = `projects/${projectPublicId}/stages/2`;

  //     res = await chai.request(url)
  //                     .post(route)
  //                     .set(headers)
  //                     .catch(function(err) {
  //                       console.log('DEBUG ERROR');
  //                       throw err;
  //                     });

  //     expect(res.status).to.be.eql(202);
  //     expect(res.body).to.have.property('amountEthers').to.be.eql(stagesCost[1]);
  //     expect(res.body).to.have.property('fromPublicId').to.be.eql(projectPublicId);
  //     expect(res.body).to.have.property('fromType').to.be.eql('project');
  //     expect(res.body).to.have.property('toPublicId').to.be.eql(ownerRes.body['publicId']);
  //     expect(res.body).to.have.property('toType').to.be.eql('user');
  //     expect(res.body).to.have.property('transactionType').to.be.eql('stageCompleted');
  //     expect(res.body).to.have.property('transactionState').to.be.eql('mining');
  //   });
  });

  // Comment this and the DB will keep its last state
  after(async function() {
    // Clean DB
    await deleteDB(chai);
  });
});
