const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

const plainText = 'Hello, Blockchain!';
const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(plainText));
const decryptedData = crypto.privateDecrypt(privateKey, encryptedData);

console.log('Encrypted:', encryptedData.toString('base64'));
console.log('Decrypted:', decryptedData.toString());


const sign = crypto.createSign('RSA-SHA256');
const dataToSign = 'Transaction Data';

sign.update(dataToSign);
const signature = sign.sign(privateKey, 'base64');

console.log('Digital Signature:', signature);

const verify = crypto.createVerify('RSA-SHA256');
verify.update(dataToSign);

const isVerified = verify.verify(publicKey, signature, 'base64');
console.log('Signature Verified:', isVerified);


class Block {
  constructor(index, previousHash, transactions, timestamp, nonce) {
    this.index = index;
    this.previousHash = previousHash;
    this.transactions = transactions;
    this.timestamp = timestamp;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256')
      .update(this.index + this.previousHash + JSON.stringify(this.transactions) + this.timestamp + this.nonce)
      .digest('hex');
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, '0', [], Date.now(), 0);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }
}

const myBlockchain = new Blockchain();
const newTransaction = { from: 'Alinur', to: 'Alibek', amount: 10 };
const newBlock = new Block(1, '', [newTransaction], Date.now(), 0);
myBlockchain.addBlock(newBlock);

console.log(JSON.stringify(myBlockchain, null, 2));
