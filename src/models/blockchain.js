var request = require("request-promise");
var async = require("async");

var block = require("./block");
var transaction = require("./transaction");

module.exports = {
  getBlockchainInfo: async () => {
    var options = {
      url: process.env.URL,
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "getblockchaininfo",
        params: []
      })
    };

    var data = await request(options);
    data = JSON.parse(data).result;

    return data;
  },
  getBlocks: async (start_height, limit, min_weight, max_weight) => {
    if (start_height < 0) {
      throw new Error('`start_height` cannot be negative')
    }
    if (limit <= 0) {
      throw new Error('`limit` argument must be a positive integer');
    }
    if (min_weight < 0) {
      throw new Error('`min_weight` cannot be negative')
    }
    if (max_weight < 0) {
      throw new Error('`max_weight` cannot be negative')
    }

    function minWeight(min, actual) {
      if (min != null) {
        if (min <= actual) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    function maxWeight(max, actual) {
      if (max != null) {
        if (max >= actual) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    

    var blocks = [];
    var data = await block.getBlockByHeight(start_height);
    if (minWeight(min_weight, data.weight) && maxWeight(max_weight, data.weight)) {
      var transactions = [];
      for (let txid of data.tx) {
        var tx = await transaction.getTransaction(txid);
        transactions.push(tx);
      }
      data.transactions = transactions;
      blocks.push(data);
    }
    var j = start_height;
    while (limit > blocks.length) {
      var data = await block.getBlockByHash(data.nextblockhash);
      if (minWeight(min_weight, data.weight) && maxWeight(max_weight, data.weight)) {
        var transactions = [];
        for (let txid of data.tx) {
          var tx = await transaction.getTransaction(txid);
          transactions.push(tx);
        }
        data.transactions = transactions;
        blocks.push(data);
      }
    }

    return blocks;
  }
};
