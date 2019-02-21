var request = require("request-promise");
var async = require("async");

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
  }
};
