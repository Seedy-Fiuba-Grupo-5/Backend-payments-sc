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

describe('Endpoint /transactions: ',()=>{
  let route = '/transactions';
  beforeEach(async function() {
    this.timeout(10000);
    // Recreate DB
    headers = requestHeaders();
    headersPayload = requestHeaders(true);
    await deleteDB(chai);
  });

  it('should return an empty list when not adding transactions or specifying query params', async function(){
    res = await chai.request(url)
                    .get(route)
                    .set(headers);
    expect(res).to.be.status(200);
    expect(res.body).to.be.a('array');
    expect(res.body).to.have.lengthOf(0);
  });

  it('should return a empty list when not adding transactions but adding some right query params', async function(){
    queryDict = {
      'fromPublicId': 1,
      'fromType': 'user',
      'toPublicId': 2,
      'toType': 'project',
      'transactionType': 'fund',
      'transactionState': 'FUNDING'
    };
    res = await chai.request(url)
                    .get(route)
                    .query(queryDict)
                    .set(headers);
    expect(res).to.be.status(200);
    expect(res.body).to.be.a('array');
    expect(res.body).to.have.lengthOf(0);
  });

  it('should return an error when some query param is wrong', async function(){
    queryDict = {
      'not a query param': 'some value'
    };
    res = await chai.request(url)
                    .get(route)
                    .query(queryDict)
                    .set(headers)
                    .catch(function(err) {
                      expect(err).to.have.status(400);
                      expect(err).to.have.property('status');
                    });
    expect(res).to.be.eql(undefined);
  });

  describe( 'GIVEN a created project in FUNDING state'+
            'with two funding made by different funders', ()=>{
    let ownerRes, reviewerRes, funderOneRes, funderTwoRes;
    let projectPublicId = 1;
    let stagesCost = [weisToEthers(2), weisToEthers(1), weisToEthers(3)];

    beforeEach(async function() {
      this.timeout(10000);
      // Recreate DB
      headers = requestHeaders();
      headersPayload = requestHeaders(true);
      await deleteDB(chai);
      // Create FUNDING project
      [ownerRes, reviewerRes, funderOneRes, funderTwoRes] = await postManyNewWallets(chai, 4);
      payload = {
        "publicId": 1,
        "ownerPublicId": ownerRes.body['publicId'],
        "reviewerPublicId": reviewerRes.body['publicId'],
        "stagesCost": stagesCost
      };
      fundingProjectRes = await createFundingProject(chai, payload);

      fundWeis = 1;
      costTxWeis = 445136000000001;
      totalWeis = fundWeis + costTxWeis;

      await addWeis(funderOneRes.body['address'], totalWeis);
      payloadOne = {
        "userPublicId": funderOneRes.body['publicId'],
        "amountEthers": weisToEthers(fundWeis)
      };
      await fundProject(chai, payloadOne, projectPublicId);

      await addWeis(funderTwoRes.body['address'], totalWeis);
      payloadTwo = {
        "userPublicId": funderTwoRes.body['publicId'],
        "amountEthers": weisToEthers(fundWeis)
      };
      await fundProject(chai, payloadTwo, projectPublicId);
    });

    it( 'should return a list of two transactions when two '+
        'transactions where done an there are not query params', async function(){
      queryDict = {};
      res = await chai.request(url)
                      .get(route)
                      .query(queryDict)
                      .set(headers)
                      .catch(function(err) {
                        console.log('DEBUG ERROR');
                        throw err;
                      });
      expect(res).to.have.status(200);
      expect(res.body).to.have.lengthOf(2);
    });

    it( 'should return a list of one transactions when two '+
        'transactions where done but they are filtered by some params', async function(){
      funderOnePublicId = funderOneRes.body['publicId'];
      queryDict = {
        'fromPublicId': funderOnePublicId
      };
      res = await chai.request(url)
                      .get(route)
                      .query(queryDict)
                      .set(headers)
                      .catch(function(err) {
                        console.log('DEBUG ERROR');
                        throw err;
                      });
      expect(res).to.have.status(200);
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.have.property('fromPublicId').to.be.eql(funderOnePublicId);
    });
  });

  after(async function() {
    // Clean DB
    await deleteDB(chai);
  });
});
