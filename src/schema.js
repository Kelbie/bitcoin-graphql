var {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require('graphql-tools');

var { resolvers } = require('./resolvers');

const typeDefs = `
  type Vin {
    coinbase: String!,
    sequence: Int!
  }

  type Vout {
    value(min: Float, max: Float): Float
  }

  type Transaction {
    txid: String!,
    version: Int!,
    size: Int!,
    vsize: Int!,
    weight: Int!
    locktime: Int!,
    time: Int!,
    vins: [Vin!],
    vouts: [Vout]
  }

  type Block {
    hash: String!,
    version: Int!,
    height: Int!,
    weight: Int!,
    merkleroot: String!,
    time: Int,
    nonce: Float!,
    difficulty: Float!,
    chainwork: String!,
    previous_block_hash: String!,
    next_block_hash: String!,
    transactions: [Transaction]
  }

  type Blockchain {
    chain: String!,
    difficulty: Float!,
    mediantime: Float!,
    chainwork: String!,
    blocks: [Block!]
  }

  type Query {
    transaction(txid: String!): Transaction!,
    block(height: Int, hash: String): Block,
    blockchain(offset: Int!, limit: Int!): Blockchain!
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = {
  schema
};