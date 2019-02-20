module.exports = {
  resolvers: {
    Query: {
      address: (root, { hash }) => {
        return {
          hash
        };
      },
    }
  }
};