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
  getBlocks: async (offset, limit) => {
    var blocks = [];

    var data = await block.getBlockByHeight(offset);
    var transactions = [];
    for (i = 0; i < data.tx.length; i++) {
      var tx = await transaction.getTransaction(data.tx[i]);
      transactions.push(tx);
    }
    data.transactions = transactions;
    blocks.push(data);

    for (i = offset; i < offset + limit - 1; i++) {
      var data = await block.getBlockByHash(data.nextblockhash);
      var transactions = [];
      for (j = 0; j < data.tx.length; j++) {
        var tx = await transaction.getTransaction(data.tx[j]);
        transactions.push(tx);
      }
      data.transactions = transactions;
      blocks.push(data);
    }

    return blocks;
  }
};
