'use stricts'

const expect = require('chai').expect;
const ethers = require("ethers");
const config = require('../../src/config')

const provider = new ethers.providers.JsonRpcProvider(config.hh_node_local_url);
const testWallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);

describe("Hardhat node's wallet for testing: ", async () => {

	it('should have 9999.990124216 ethers', async () => {
    const address = await testWallet.getAddress();
    weisBalance = await provider.getBalance(address);
    ethersBalance = ethers.utils.formatEther(weisBalance);
    expect(ethersBalance).to.be.eql("9999.990124216");
	});
});
