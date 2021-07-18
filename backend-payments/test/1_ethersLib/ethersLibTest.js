'use stricts'

const expect = require('chai').expect;
const config = require('../../src/config');
const ethers = require("ethers");

describe('ethers.js: ', ()=>{
  let provider = new ethers.providers.JsonRpcProvider(config.hhNodeURL);
  let testWallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic)
                                .connect(provider);

  it('New wallet should not have any ethers (weis)', async () => {
    const wallet = ethers.Wallet.createRandom().connect(provider);

    weisBalance = await provider.getBalance(wallet.address);
    expect( weisBalance ).to.be.eql( ethers.BigNumber.from(0) );
	});

  it('It should be possible to transfer 1 wei to a new wallet', async () => {
    const wallet = ethers.Wallet.createRandom().connect(provider);
    const weisSend = ethers.BigNumber.from(1);
    const tx = {
      to: wallet.address,
      value: weisSend
    };
    const testPreBalance = await provider.getBalance(testWallet.address);
    await testWallet.sendTransaction(tx);

    const weisBalance = await provider.getBalance(wallet.address);
    expect( weisBalance ).to.be.eql( weisSend );

    const txWeisCost = ethers.BigNumber.from(168000000000000);
    testDiffBalance = testPreBalance;
    testDiffBalance = testDiffBalance.sub(weisSend);
    testDiffBalance = testDiffBalance.sub(txWeisCost);
    const testWalletPostBalance = await provider.getBalance(testWallet.address);
    expect( testWalletPostBalance ).to.be.eql( testDiffBalance );
	});

  it('New wallet should have a mnemonic phrase', async () => {
    const wallet = ethers.Wallet.createRandom();

    expect( wallet.mnemonic.phrase ).to.be.a('string');
    // console.log(`\tNew wallet mnemonic: ${wallet.mnemonic.phrase}`);
  });
});
