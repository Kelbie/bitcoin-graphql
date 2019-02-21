var async = require('async');

var transaction = require("./models/transaction");
var block = require("./models/block");
var blockchain = require("./models/blockchain");

module.exports = {
  resolvers: {
    Query: {
      transaction: async (root, { txid }) => {
        var data = await transaction.transaction(txid);
        data = JSON.parse(data).result;

        return {
          txid: data.txid,
          version: data.version,
          size: data.size,
          vsize: data.vsize,
          weight: data.weight,
          locktime: data.locktime, 
          time: data.time
        }
      },
      block: async (obj, args, context, info) => {
        var data;
        if (args.hash != null) {
          data = await block.getBlockByHash(args.hash);
          data = JSON.parse(data).result;
        } else if (args.height != null) {
          data = await block.getBlockByHeight(args.height);
          data = JSON.parse(data).result;
        }

        var transactions = [];
        for (i = 0; i < data.tx.length; i++) {
          var tx_data = await transaction.transaction(data.tx[i]);
          transactions.push(JSON.parse(tx_data).result);
        }

        return {
          hash: data.hash,
          version: data.version,
          height: data.height,
          weight: data.weight,
          merkleroot: data.merkleroot,
          nonce: data.nonce, 
          difficulty: data.difficulty,
          chainwork: data.chainwork,
          time: data.time,
          previous_block_hash: data.previousblockhash,
          next_block_hash: data.nextblockhash,
          transactions: [...transactions]
        }
      },
      blockchain: async (obj, args, context, info) => {
        var data = await blockchain.getBlockchainInfo();
        data = JSON.parse(data).result;

        return {
          chain: data.chain,
          difficulty: data.difficulty,
          mediantime: data.mediantime,
          chainwork: data.chainwork
        }
      }
    }
  }
};