var async = require('async')

var transaction = require("./models/transaction")

module.exports = {
  resolvers: {
    Query: {
      transaction: async (root, { txid }) => {
        var data = await transaction.transaction(txid);
        data = JSON.parse(data).result

        return {
          txid: data.txid,
          version: data.version,
          size: data.size,
          vsize: data.vsize,
          weight: data.weight,
          locktime: data.locktime, 
          time: data.time
        }
      },
    }
  }
};