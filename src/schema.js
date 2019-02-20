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

  type Query {
    transaction(txid: String!): Transaction!
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = {
  schema
};