var request = require("request-promise");
var async = require("async");

module.exports = {
  getBlockByHash: async hash => {
    var options = {
      url: process.env.URL,
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
      url: process.env.URL,
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
      url: process.env.URL,
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
