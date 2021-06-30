'use stricts'

const expect = require('chai').expect;
const config = require('../src/config');
const ethers = require("ethers");

describe('ethers.js: ', ()=>{
  let provider = new ethers.providers.JsonRpcProvider(config.hh_node_local_url);

  it('New wallet should not have any ethers (weis)', async () => {
    const wallet = ethers.Wallet.createRandom().connect(provider);

    weisBalance = await provider.getBalance(wallet.address);
    expect( weisBalance ).to.be.eql( ethers.BigNumber.from(0) );
	});
});
