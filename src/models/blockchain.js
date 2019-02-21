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

    return await request(options);
  },
  getBlocks: async (offset, limit) => {
    var blocks = [];

    var data = await block.getBlockByHeight(offset);
    data = JSON.parse(data).result;
    var transactions = [];
    for (i = 0; i < data.tx.length; i++) {
      var tx = await transaction.transaction(data.tx[i]);
      tx = JSON.parse(tx).result;
      transactions.push(tx);
    }
    data.transactions = transactions;
    blocks.push(data);

    for (i = offset; i < offset + limit - 1; i++) {
      var data = await block.getBlockByHash(data.nextblockhash);
      data = JSON.parse(data).result;
      var transactions = [];
      for (j = 0; j < data.tx.length; j++) {
        var tx = await transaction.transaction(data.tx[j]);
        tx = JSON.parse(tx).result;
        transactions.push(tx);
      }
      data.transactions = transactions;
      blocks.push(data);
    }

    return blocks;
  }
};
