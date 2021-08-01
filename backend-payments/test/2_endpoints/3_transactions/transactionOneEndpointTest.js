'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const { 
  requestHeaders, 
  deleteDB 
} = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /transactions/<id>: ',()=>{
  beforeEach(async function() {
    this.timeout(10000);
    // Recreate DB
    headers = requestHeaders();
    headersPayload = requestHeaders(true);
    await deleteDB(chai);
  });

  it('Should return an error when the transaction does not exists', async function(){
    route = `/transactions/9999`;
    res = await chai.request(url)
                    .get(route)
                    .set(headers)
                    .catch(function(err) {
                      expect(err).to.have.status(404);
                      expect(err.response.body).to.have.property('status');
                    });
    expect(res).to.be.eql(undefined);
  });

  after(async function() {
    // Clean DB
    await deleteDB(chai);
  });
});

