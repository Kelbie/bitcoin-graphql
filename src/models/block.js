var request = require("request-promise");
var async = require("async");
var Options = require("../utils/options");

module.exports = {
  getBlockByHash: async hash => {
    var options = Options("getblock", [hash]);

    var data = await request(options);
    data = JSON.parse(data).result

    return data;
  },
  getBlockByHeight: async (height) => {
    var options = Options("getblockhash", [height]);

    var data = await request(options);
    var hash = JSON.parse(data).result;

    options = Options("getblock", [hash]);

    data = await request(options);
    data = JSON.parse(data).result;

    return data;
  },
  getBestBlockHash: async () => {
    var options = Options("getbestblockhash", []);

    var data = await request(options);
    data = JSON.parse(data).result;

    return data;
  }
};
