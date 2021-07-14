'use stricts'

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const config = require('../../../src/config')

chai.use(chaiHttp);
const url = `http://0.0.0.0:${config.web_port}`;

describe('Endpoint /: ', () => {
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
