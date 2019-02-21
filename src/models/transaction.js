var request = require("request-promise");
var async = require("async");

module.exports = {
  getTransaction: async (txid) => {
    // If txid corresponds to the genesis transaction
    if (txid == "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b") {

      var hash = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f";

      var options = {
        url: "http://user:pass@127.0.0.1:18332",
        method: "POST",
        body: JSON.stringify({
          jsonrpc: "1.0",
          id: "curltest",
          method: "getblock",
          params: [
            hash,
            2
          ]
        })
      };
  
      var data = await request(options);
      data = JSON.parse(data).result.tx[0];

      data.vins = data.vin;
      data.vouts = data.vout;

      return data;

    } else {

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
  
      var data = await request(options);
      data = JSON.parse(data).result;
  
      data.vins = data.vin;
      data.vouts = data.vout;
  
      return data;
    }

  }
};