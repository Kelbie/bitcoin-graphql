var {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require('graphql-tools');

var { resolvers } = require('./resolvers');

const typeDefs = `
  type Vin {
    txid: String,
    vout: Int,
    coinbase: String,
    sequence: Float
  }

  type Vout {
    value: Float
  }

  type Transaction {
    txid: String,
    version: Int,
    size: Int,
    vsize: Int,
    weight: Int
    locktime: Int,
    time: Int,
    vins: [Vin],
    vouts(minValue: Float, maxValue: Float): [Vout]
  }

  type Block {
    hash: String,
    version: Int,
    height: Int,
    weight: Int,
    merkleroot: String,
    time: Int,
    nonce: Float,
    difficulty: Float,
    chainwork: String,
    previous_block_hash: String,
    next_block_hash: String,
    transactions(coinbaseOnly: Boolean): [Transaction]
  }

  type Blockchain {
    chain: String,
    difficulty: Float,
    mediantime: Float,
    chainwork: String,
    blocks(start_height: Int!, limit: Int!, min_weight: Int, max_weight: Int): [Block]
  }

  type Query {
    transaction(txid: String): Transaction,
    block(height: Int, hash: String): Block,
    blockchain: Blockchain
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = {
  schema
};