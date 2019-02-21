var request = require("request-promise");
var async = require("async");

module.exports = {
  transaction: async (txid) => {
    var options = {
      url: "http://user:pass@127.0.0.1:18332",
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "getrawtransaction",
        params: [
          txid,
          true
        ]
      })
    };

    return await request(options);
  }
};