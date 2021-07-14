'use stricts'

// Test suit
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

// Auxiliary
const { serverURL } = require('../aux');

chai.use(chaiHttp);

describe('Endpoint /: ', () => {
  let url = serverURL();
  let route = '/';

	it('GET should return 401 when the api key header was not set up', async function() {
    errGet = null;
    await chai.request(url)
      .get(route)
      .catch(function(err) {
        expect(err).to.have.status(401);
    });
	});
});
