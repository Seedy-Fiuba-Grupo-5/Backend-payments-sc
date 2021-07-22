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
  createFundingProject,
  weisToEthers,
  addWeis
} = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /projects/<id>/funds: ',()=>{
  let url = serverURL();

  describe('Given a created project in FUNDING state', ()=>{
    beforeEach(async function() {
      this.timeout(10000);
      // Recreate DB
      headers = requestHeaders();
      headersPayload = requestHeaders(true);
      await deleteDB(chai);
      // Create FUNDING project
      let [ownerRes, reviewerRes] = await postManyNewWallets(chai, 2);
      payload = {
        "publicId": 1,
        "ownerPublicId": ownerRes.body['publicId'],
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stagesCost": [weisToEthers(2), weisToEthers(1), weisToEthers(3)]
      };
      fundingProjectRes = await createFundingProject(chai, payload);
      route = `/projects/${fundingProjectRes.body['publicId']}/funds`;
    });

    it( 'POST 1 wei should add 1 wei to the project balance, ' +
        'if the funder has enough ethers to make this transaction', async function () {
      let [funderRes] = await postManyNewWallets(chai, 1);
      fundWeis = 1;
      costTxWeis = 445040000000000;
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
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundWeis));
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
      costTxWeis = 445040000000000;
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
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundWeis));
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
      expect(res.body).to.have.property('amountEthers').to.be.eql(weisToEthers(fundWeis));
      expect(res.body).to.have.property('fromPublicId').to.be.eql(funder2Res.body['publicId']);
      expect(res.body).to.have.property('fromType').to.be.eql('user');
      expect(res.body).to.have.property('toPublicId').to.be.eql(fundingProjectRes.body['publicId']);
      expect(res.body).to.have.property('toType').to.be.eql('project');
      expect(res.body).to.have.property('transactionType').to.be.eql('fund');
      expect(res.body).to.have.property('transactionState').to.be.eql('mining');
    });
  });
});
