'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

// Auxiliary
const ethers = require("ethers");
const config = require('../../../src/config')
const { getHeaders } = require('../aux');

describe('Endpoint /wallets/<id>: ',()=>{
  let url = `http://0.0.0.0:${config.web_port}`;
  let parcialRoute = '/wallets';
  let provider = new ethers.providers.JsonRpcProvider(config.hh_node_url);
  let testWallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic)
                                .connect(provider);

  beforeEach(async function() {
    headers = getHeaders();
    await chai.request(url).delete('/db').set(headers);
  });

	it('GET should return a wallet without ethers when it was just created', async () => {
    const publicId = 1;
    const payload = { "publicId": publicId };
    headers_post = {...headers};
    headers_post['content-type'] = 'application/json';
    res = await chai.request(url)
                    .post(parcialRoute)
                    .set(headers_post)
                    .send(payload);
    route = `${parcialRoute}/${publicId}`;

		res = await chai.request(url).get(route).set(headers);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('balance').to.be.eql('0.0');
	});

  it('GET should return a wallet with 10^(-18) ethers (1 wei) when it was just loaded with that',
      async () => {
    const publicId = 1;
    const payload = { "publicId": publicId };
    headers['content-type'] = 'application/json';
    res = await chai.request(url)
                    .post(parcialRoute)
                    .set(headers)
                    .send(payload);
    const route = `${parcialRoute}/${publicId}`;
    const address = res.body.address;
    const weisLoad = ethers.BigNumber.from(1);
    const tx = {to: address, value: weisLoad};

    await testWallet.sendTransaction(tx);

		res = await chai.request(url).get(route).set(headers);
    expect(res).to.have.status(200);
    const ethersLoad = ethers.utils.formatEther(weisLoad);
    expect(res.body).to.have.property('balance').to.be.eql( ethersLoad );
	});
});
