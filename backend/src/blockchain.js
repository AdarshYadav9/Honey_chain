const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

// In-memory blockchain for the Honey Chain traceability prototype
const blockchain = [];

// Helper to compute SHA-256 hash
function calculateHash(index, previousHash, timestamp, data) {
  return crypto
    .createHash('sha256')
    .update(index + previousHash + timestamp + JSON.stringify(data))
    .digest('hex');
}

// Create Genesis Block
function initBlockchain() {
  const genesisData = { message: 'Honey Chain Genesis Block - KVIC Honey Mission' };
  const genesisTimestamp = '2025-01-01T00:00:00.000Z';
  const genesisHash = calculateHash(0, '0', genesisTimestamp, genesisData);
  blockchain.push({
    index: 0,
    timestamp: genesisTimestamp,
    data: genesisData,
    previousHash: '0',
    hash: genesisHash
  });
}

function addBlockToChain(type, payload) {
  const lastBlock = blockchain[blockchain.length - 1];
  const newIndex = blockchain.length;
  const timestamp = new Date().toISOString();
  const blockData = { type, payload, txId: uuidv4() };
  const newHash = calculateHash(newIndex, lastBlock.hash, timestamp, blockData);

  const block = {
    index: newIndex,
    timestamp,
    data: blockData,
    previousHash: lastBlock.hash,
    hash: newHash
  };
  blockchain.push(block);
  return block;
}

initBlockchain();

module.exports = { blockchain, calculateHash, initBlockchain, addBlockToChain };