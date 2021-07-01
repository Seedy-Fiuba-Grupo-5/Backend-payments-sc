'use stricts'

// Test suit
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = require('chai').expect;

// Auxiliary
const ethers = require("ethers");
const config = require('../../src/config')

describe('Endpoint /wallets/<id>: ',()=>{
  let url = `http://0.0.0.0:${config.web_port}`;
  let parcialRoute = '/wallets';
  let provider = new ethers.providers.JsonRpcProvider(config.hh_node_url);
  let testWallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic)
                                .connect(provider);

  beforeEach(async function() {
    await chai.request(url).delete('/db');
  });

	it('GET should return a wallet without ethers when it was just created', async () => {
    res = await chai.request(url).post(parcialRoute);
    id = res.body['id']
    route = `${parcialRoute}/${id}`;

		res = await chai.request(url).get(route);
    expect(res).to.have.status(200);
    expect(res.body).to.have.property('address').to.be.a('string');
    expect(res.body).to.have.property('privateKey').to.be.a('string');
    expect(res.body).to.have.property('balance').to.be.eql('0.0');
	});

  it('GET should return a wallet with 10^(-18) ethers (1 wei) when it was just loaded with that',
      async () => {
    res = await chai.request(url).post(parcialRoute);
    const id = res.body['id']
    const route = `${parcialRoute}/${id}`;
    const address = res.body.address;
    const weisLoad = ethers.BigNumber.from(1);
    const tx = {to: address, value: weisLoad};

    await testWallet.sendTransaction(tx);

		res = await chai.request(url).get(route);
    expect(res).to.have.status(200);
    const ethersLoad = ethers.utils.formatEther(weisLoad);
    expect(res.body).to.have.property('balance').to.be.eql( ethersLoad );
	});
});
