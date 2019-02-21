var request = require("request-promise");
var async = require("async");

module.exports = {
  getBlockByHash: async hash => {
    var options = {
      url: "http://user:pass@127.0.0.1:18332",
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "getblock",
        params: [hash]
      })
    };

    var data = await request(options);
    data = JSON.parse(data).result

    return data;
  },
  getBlockByHeight: async (height) => {
    var options = {
      url: "http://user:pass@127.0.0.1:18332",
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "getblockhash",
        params: [height]
      })
    };

    var data = await request(options);
    var hash = JSON.parse(data).result;

    var options = {
      url: "http://user:pass@127.0.0.1:18332",
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: "getblock",
        params: [hash]
      })
    };

    data = await request(options);
    data = JSON.parse(data).result

    return data;
  }
};
