var request = require("request-promise");
var async = require("async");

var block = require("./block");
var transaction = require("./transaction");

module.exports = {
  getBlockchainInfo: async () => {
    var options = {
      url: "http://user:pass@127.0.0.1:18332",
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
      for (i = 0; i < data.tx.length; i++) {
        var tx = await transaction.getTransaction(data.tx[i]);
        transactions.push(tx);
      }
      data.transactions = transactions;
      blocks.push(data);
    }

    var j = start_height;
    while (j + limit - 1 > blocks.length) {
      var data = await block.getBlockByHash(data.nextblockhash);
      if (minWeight(min_weight, data.weight) && maxWeight(max_weight, data.weight)) {
        var transactions = [];
        for (j = 0; j < data.tx.length; j++) {
          var tx = await transaction.getTransaction(data.tx[j]);
          transactions.push(tx);
        }
        data.transactions = transactions;
        blocks.push(data);
      }
    }

    return blocks;
  }
};
