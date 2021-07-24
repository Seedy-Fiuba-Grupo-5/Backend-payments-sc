'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

// Auxiliary
const {
  serverURL,
  requestHeaders,
  weisToEthers,
  addWeis,
  sleep,
  deleteDB,
  postManyNewWallets,
  getWallet,
  createFundingProject,
  fundProject,
  getProject
} = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /projects/<id>/funds: ',()=>{
  let url = serverURL();

  describe('GIVEN a created project in FUNDING state', ()=>{
    let ownerRes, reviewerRes;
    let projectPublicId = 1;
    let stagesCost = [weisToEthers(2), weisToEthers(1), weisToEthers(3)];

    beforeEach(async function() {
      this.timeout(10000);
      // Recreate DB
      headers = requestHeaders();
      headersPayload = requestHeaders(true);
      await deleteDB(chai);
      // Create FUNDING project
      [ownerRes, reviewerRes] = await postManyNewWallets(chai, 2);
      payload = {
        "publicId": 1,
        "ownerPublicId": ownerRes.body['publicId'],
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stagesCost": stagesCost
      };
      fundingProjectRes = await createFundingProject(chai, payload);
      route = `/projects/${projectPublicId}/funds`;
    });

    it( 'POST 1 wei should add 1 wei to the project balance, ' +
        'if the funder has enough ethers to make this transaction', async function () {
      let [funderRes] = await postManyNewWallets(chai, 1);
      fundWeis = 1;
      costTxWeis = 445136000000001;
      totalWeis = fundWeis + costTxWeis;
      await addWeis(funderRes.body['address'], totalWeis);

      payload = {
        "userPublicId": funderRes.body['publicId'],
        "amountEthers": weisToEthers(fundWeis)
      };

      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payload)
                      .catch(function(err) {
                        console.log('DEBUG ERROR');
                        throw err;
                      });

      expect(res.status).to.be.eql(202);
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundWeis).toString());
      expect(res.body).to.have.property('fromPublicId').to.be.eql(funderRes.body['publicId']);
      expect(res.body).to.have.property('fromType').to.be.eql('user');
      expect(res.body).to.have.property('toPublicId').to.be.eql(fundingProjectRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('project');
      expect(res.body).to.have.property('transactionType').to.be.eql('fund');
      expect(res.body).to.have.property('transactionState').to.be.eql('mining');
    });

    it( 'POST 1 wei from 1 user and another wei from another user should add 2 wei to the project balance, ' +
        'if the funders have enough ethers to make the transactions', async function () {
      let [funder1Res, funder2Res] = await postManyNewWallets(chai, 2);
      fundWeis = 1;
      costTxWeis = 445136000000001;
      totalWeis = fundWeis + costTxWeis;
      await addWeis(funder1Res.body['address'], totalWeis);
      await addWeis(funder2Res.body['address'], totalWeis);

      payloadFounder1 = {
        "userPublicId": funder1Res.body['publicId'],
        "amountEthers": weisToEthers(fundWeis)
      };
      payloadFounder2 = {
        "userPublicId": funder2Res.body['publicId'],
        "amountEthers": weisToEthers(fundWeis)
      };

      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payloadFounder1)
                      .catch(function(err) {
                        console.log('DEBUG ERROR');
                        throw err;
                      });
      expect(res.status).to.be.eql(202);
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundWeis).toString());
      expect(res.body).to.have.property('fromPublicId').to.be.eql(funder1Res.body['publicId']);
      expect(res.body).to.have.property('fromType').to.be.eql('user');
      expect(res.body).to.have.property('toPublicId').to.be.eql(fundingProjectRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('project');
      expect(res.body).to.have.property('transactionType').to.be.eql('fund');
      expect(res.body).to.have.property('transactionState').to.be.eql('mining');

      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payloadFounder2)
                      .catch(function(err) {
                        console.log('DEBUG ERROR');
                        throw err;
                      });
      expect(res.status).to.be.eql(202);
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundWeis).toString());
      expect(res.body).to.have.property('fromPublicId').to.be.eql(funder2Res.body['publicId']);
      expect(res.body).to.have.property('fromType').to.be.eql('user');
      expect(res.body).to.have.property('toPublicId').to.be.eql(fundingProjectRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('project');
      expect(res.body).to.have.property('transactionType').to.be.eql('fund');
      expect(res.body).to.have.property('transactionState').to.be.eql('mining');
    });

    it( 'POST exactly total weis needed for a project should add that amount of weis to the project balance, ' +
        'if the funder has enough ethers to make this transaction', async function () {
      let [funderRes] = await postManyNewWallets(chai, 1);
      fundWeis = 6;
      costTxWeis = 911112000000006;
      totalWeis = fundWeis + costTxWeis;
      await addWeis(funderRes.body['address'], totalWeis);

      payload = {
        "userPublicId": funderRes.body['publicId'],
        "amountEthers": weisToEthers(fundWeis)
      };

      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payload)
                      .catch(function(err) {
                        console.log('DEBUG ERROR');
                        throw err;
                      });

      expect(res.status).to.be.eql(202);
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundWeis).toString());
      expect(res.body).to.have.property('fromPublicId').to.be.eql(funderRes.body['publicId']);
      expect(res.body).to.have.property('fromType').to.be.eql('user');
      expect(res.body).to.have.property('toPublicId').to.be.eql(fundingProjectRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('project');
      expect(res.body).to.have.property('transactionType').to.be.eql('fund');
      expect(res.body).to.have.property('transactionState').to.be.eql('mining');

      transactionId = res.body['id'];
      while (res.body['transactionState'] === 'mining'){
        this.timeout(10000);
        res = await chai.request(url)
                        .get(`/transactions/${transactionId}`)
                        .set(headers)
                        .catch(function(err) {
                          console.log('DEBUG ERROR');
                          throw err;
                        });
      }

      expect(res.status).to.be.eql(200);
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundWeis).toString());
      expect(res.body).to.have.property('fromPublicId').to.be.eql(funderRes.body['publicId']);
      expect(res.body).to.have.property('fromType').to.be.eql('user');
      expect(res.body).to.have.property('toPublicId').to.be.eql(fundingProjectRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('project');
      expect(res.body).to.have.property('transactionType').to.be.eql('fund');
      expect(res.body).to.have.property('transactionState').to.be.eql('done');
    });

    it( 'POST more than total weis needed for a project should add just the amount of weis needed for the project balance, ' +
        'if the funder has enough ethers to make this transaction', async function () {
      let [funderRes] = await postManyNewWallets(chai, 1);
      fundWeis = 7;
      fundNeeded = 6;
      costTxWeis = 973080000000007;
      totalWeis = fundWeis + costTxWeis;
      await addWeis(funderRes.body['address'], totalWeis);

      payload = {
        "userPublicId": funderRes.body['publicId'],
        "amountEthers": weisToEthers(fundWeis)
      };

      res = await chai.request(url)
                      .post(route)
                      .set(headersPayload)
                      .send(payload)
                      .catch(function(err) {
                        console.log('DEBUG ERROR');
                        throw err;
                      });

      expect(res.status).to.be.eql(202);
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundWeis).toString());
      expect(res.body).to.have.property('fromPublicId').to.be.eql(funderRes.body['publicId']);
      expect(res.body).to.have.property('fromType').to.be.eql('user');
      expect(res.body).to.have.property('toPublicId').to.be.eql(fundingProjectRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('project');
      expect(res.body).to.have.property('transactionType').to.be.eql('fund');
      expect(res.body).to.have.property('transactionState').to.be.eql('mining');

      transactionId = res.body['id'];
      do {
        await sleep(1000);
        res = await chai.request(url)
                        .get(`/transactions/${transactionId}`)
                        .set(headers)
                        .catch(function(err) {
                          console.log('DEBUG ERROR');
                          throw err;
                        });
      } while (res.body['transactionState'] !== 'done');

      expect(res.body).to.have.property('transactionState').to.be.eql('done');
      expect(res.status).to.be.eql(200);
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundNeeded).toString());
      expect(res.body).to.have.property('fromPublicId').to.be.eql(funderRes.body['publicId']);
      expect(res.body).to.have.property('fromType').to.be.eql('user');
      expect(res.body).to.have.property('toPublicId').to.be.eql(fundingProjectRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('project');
      expect(res.body).to.have.property('transactionType').to.be.eql('fund');
    });

    describe('WHEN the project reaches the IN_PROGRESS state', async function() {
      let funderRes;
      beforeEach(async function() {
        // Timeout limit for this pre-test
        this.timeout(10000);
        // Fund until be IN_PROGRESS
        [funderRes] = await postManyNewWallets(chai, 1);
        fundWeis = 6; // stagesCost sum should be 6 weis
        txCostWeis = 972976000000007;
        totalWeis = fundWeis + txCostWeis;
        addWeis(funderRes.body['address'], txCostWeis);
        funderPayload = {
          "userPublicId": funderRes.body['publicId'],
          "amountEthers": weisToEthers(fundWeis)
        };
        await fundProject(chai, funderPayload, projectPublicId);
        let res;
        do {
          await sleep(1000);
          res = await getProject(chai, projectPublicId);
        } while (res.body['state'] != 'IN_PROGRESS');
      });
      it('THEN the owner of the project should receive the funds of the first stage of it', async function(){
        res = await getWallet(chai, ownerRes.body['publicId']);
        expect(res).have.status(200);
        expect(res.body).have.property('balance').to.be.eql(stagesCost[0]);
      });

      it('THEN try to fund it should fail with status code 409', async function(){
        let [funderRes] = await postManyNewWallets(chai, 1);
        fundWeis = 1;
        costTxWeis = 445136000000001;
        totalWeis = fundWeis + costTxWeis;
        await addWeis(funderRes.body['address'], totalWeis);

        payload = {
          "userPublicId": funderRes.body['publicId'],
          "amountEthers": weisToEthers(fundWeis)
        };
        res = await chai.request(url)
                        .post(route)
                        .set(headersPayload)
                        .send(payload)
                        .catch(function(err) {
                          expect(err.status).to.be.eql(409);
                        });

      });

      it('THEN try to fund an unexisting proyect should fail with status code 404', async function(){
        let [funderRes] = await postManyNewWallets(chai, 1);
        fundWeis = 1;
        costTxWeis = 445136000000001;
        totalWeis = fundWeis + costTxWeis;
        await addWeis(funderRes.body['address'], totalWeis);

        payload = {
          "userPublicId": funderRes.body['publicId'],
          "amountEthers": weisToEthers(fundWeis)
        };
        res = await chai.request(url)
                        .post(`/projects/100000/funds`)
                        .set(headersPayload)
                        .send(payload)
                        .catch(function(err) {
                          expect(err.status).to.be.eql(404);
                        });

      });

    });
  });
});
