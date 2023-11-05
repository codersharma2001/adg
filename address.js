const { AVMAPI, KeyChain, BinTools, AVA, Buffer, AVMTx, AVMTxUnsigned } = require('avalanche');

const ava = new AVA('localhost', 9650);
const avm = ava.X;
const avax = ava.X;
const bintools = BinTools.getInstance();

const mnemonic = 'chimney asset heavy ecology accuse window gold weekend annual oil emerge alley retreat rabbit seed advance define off amused board quick wealth peasant disorder';

const keyChain = avax.keyChain();

keyChain.importKey(mnemonic);

const cAddresses = [];

for (let i = 0; i <= 2; i++) {
  const keyPair = keyChain.makeKey();
  const cchainAddress = keyPair.getAddressString();
  cAddresses.push(cchainAddress);
}

console.log(cAddresses);