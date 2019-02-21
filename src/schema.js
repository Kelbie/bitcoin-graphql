var {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require('graphql-tools');

var { resolvers } = require('./resolvers');

const typeDefs = `
  type Transaction {
    txid: String!,
    version: Int!,
    size: Int!,
    vsize: Int!,
    weight: Int!
    locktime: Int!,
    time: Int!
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

  type Query {
    transaction(txid: String!): Transaction!,
    block(height: Int, hash: String): Block
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = {
  schema
};