const crypto = require('crypto');
const { Mnemonic } = require("avalanche");
const mnemonic = Mnemonic.getInstance();
const strength = 256;
const wordlist = mnemonic.getWordlists("english");
const m = mnemonic.generateMnemonic(strength, crypto.randomBytes, wordlist);
console.log(m);
