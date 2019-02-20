var {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require('graphql-tools');

var { resolvers } = require('./resolvers');

const typeDefs = `
  type Address {
    hash: String!
  }

  type Query {
    address(hash: String!): Address!
  }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = {
  schema
};