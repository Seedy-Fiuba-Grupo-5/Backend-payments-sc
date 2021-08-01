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
  getWallet,
  setCompletedStage
} = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /projects/<id>/stages: ',()=>{
  let url = serverURL();

  describe('Given a created project in IN_PROGRESS state', ()=>{
    let ownerRes, reviewerRes, funderRes;
    let projectPublicId = 1;
    let stagesCost = [weisToEthers(2), weisToEthers(1), weisToEthers(3)];

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
      expect(res.body).to.have.property('state').to.be.eql('In progress');
    });

    it ('The owner of the project should have the funds of the first stage of it', async function () {
      res = await getWallet(chai, ownerRes.body['publicId']);
      expect(res.body).to.have.property('balance').to.be.eql(stagesCost[0]);
    });

    it( 'The reviewer of the project, should be able to set the first stage as complete '+
        'if it has enough ethers to make this transaction, '+
        'and the funds of the up to next stage should be released', async function () {
      costTxWeis = 560288000000000;
      await addWeis(reviewerRes.body['address'], costTxWeis);
      route = `/projects/${projectPublicId}/stages`;
      stageNumber = 1;
      payload = {
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stageNumber": stageNumber
      }

      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payload)
                      .catch(function(err) {
                        console.log('DEBUG ERROR');
                        console.log(err);
                        throw err;
                      });

      expect(res.status).to.be.eql(202);
      expect(res.body).to.have.property('amountEthers').to.be.eql(stagesCost[stageNumber]);
      expect(res.body).to.have.property('fromPublicId').to.be.eql(projectPublicId);
      expect(res.body).to.have.property('fromType').to.be.eql('project');
      expect(res.body).to.have.property('toPublicId').to.be.eql(ownerRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('user');
      expect(res.body).to.have.property('transactionType').to.be.eql('stageCompleted');
      expect(res.body).to.have.property('transactionState').to.be.oneOf(['mining', 'done']);
    });

    it( 'The reviewer of the project, should be able to set the second stage as complete '+
    'if it has enough ethers to make this transaction, '+
    'and the funds of the up to next stage should be released', async function () {
      costTxWeis = 560288000000000;
      await addWeis(reviewerRes.body['address'], costTxWeis);
      route = `/projects/${projectPublicId}/stages`;
      stageNumber = 2;
      payload = {
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stageNumber": stageNumber
      }

      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payload)
                      .catch(function(err) {
                        console.log('DEBUG ERROR');
                        console.log(err);
                        throw err;
                      });

      expect(res.status).to.be.eql(202);
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(4));
      expect(res.body).to.have.property('fromPublicId').to.be.eql(projectPublicId);
      expect(res.body).to.have.property('fromType').to.be.eql('project');
      expect(res.body).to.have.property('toPublicId').to.be.eql(ownerRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('user');
      expect(res.body).to.have.property('transactionType').to.be.eql('stageCompleted');
      expect(res.body).to.have.property('transactionState').to.be.oneOf(['mining', 'done']);
    });

    describe('WHEN the reviewer sets stage 1 as completed', ()=>{
      beforeEach(async function() {
        stageNumber = 1
        // Timeout limit for this pre-test
        this.timeout(10000);

        // Aux headers
        headers = requestHeaders();
        headersPayload = requestHeaders(true);

        costTxWeis = 560288000000000;
        await addWeis(reviewerRes.body['address'], costTxWeis);
        payload = {
          "reviewerPublicId": reviewerRes.body['publicId'],
          "stageNumber": stageNumber
        };
        res = await setCompletedStage(chai, payload, projectPublicId);
      });

      it('THEN the project should have until stage 1 marked as completed', async function () {
        stageNumber = 1;
        res = await getProject(chai, projectPublicId);
        stagesStates = stagesCost.map((_, i) => i < stageNumber);
        expect(res.status).to.be.eql(200);
        expect(res.body).to.have.property('stagesStates').to.be.eql(stagesStates);
      });

      it('THEN it should not be able to set it as completed again', async function () {
        stageNumber = 1;
        costTxWeis = 560288000000000;
        await addWeis(reviewerRes.body['address'], costTxWeis);
        payload = {
          "reviewerPublicId": reviewerRes.body['publicId'],
          "stageNumber": stageNumber
        };
        route = `/projects/${projectPublicId}/stages`;
        res = await chai.request(url)
                        .post(route)
                        .set(headersPayload)
                        .send(payload)
                        .catch(function (err) {
                          expect(err).to.have.status(409);
                          expect(err.response.body).to.have.property('status');
                        });
        expect(res).to.be.eql(undefined);
      });
    });

    it ('THEN it should return an error if the reviewer has not enough ethers to make the transaction', async function() {
      route = `/projects/${projectPublicId}/stages`;
      stageNumber = 1;
      payload = {
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stageNumber": stageNumber
      };
      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payload)
                      .catch(function(err) {
                        expect(err).to.have.status(409);
                        expect(err.response.body).to.have.property('status');
                      });
      expect(res).to.be.eql(undefined);
    });

    it ('THEN it should return an error when try to set an stage completed of an unexistent project', async function() {
      route = `/projects/9999/stages`;
      stageNumber = 1;
      payload = {
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stageNumber": stageNumber
      };
      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payload)
                      .catch(function(err) {
                        expect(err).to.have.status(404);
                        expect(err.response.body).to.have.property('status');
                      });
      expect(res).to.be.eql(undefined);
    });

    it ('THEN it should return an error when reviewer does not match the reviewer of the project', async function() {
      route = `/projects/${projectPublicId}/stages`;
      stageNumber = 1;
      payload = {
        "reviewerPublicId": reviewerRes.body['publicId']+100,
        "stageNumber": stageNumber
      };
      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payload)
                      .catch(function(err) {
                        expect(err).to.have.status(403);
                        expect(err.response.body).to.have.property('status');
                      });
      expect(res).to.be.eql(undefined);
    });

    it ('THEN it should return an error when trying to set an stage out of bounds', async function() {
      route = `/projects/${projectPublicId}/stages`;
      stageNumber = 9999;
      payload = {
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stageNumber": stageNumber
      };
      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payload)
                      .catch(function(err) {
                        expect(err).to.have.status(400);
                        expect(err.response.body).to.have.property('status');
                      });
      expect(res).to.be.eql(undefined);
    });

    it( 'THEN reviewer should be able to set the last stage as completed'+
        'and the project should change to COMPLETED state', async function() {
      costTxWeis = 560288000000000;
      await addWeis(reviewerRes.body['address'], costTxWeis);
      payload = {
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stageNumber": stagesCost.length
      };
      await setCompletedStage(chai, payload, projectPublicId);
      res = await getProject(chai, projectPublicId);

      expect(res.body).to.have.property('state').to.be.eql('COMPLETED');

    });
  });

  // Comment this and the DB will keep its last state
  after(async function() {
    // Clean DB
    await deleteDB(chai);
  });
});
