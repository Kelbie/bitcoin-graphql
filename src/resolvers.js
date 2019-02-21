var async = require('async');

var transaction = require("./models/transaction");
var block = require("./models/block");
var blockchain = require("./models/blockchain");

module.exports = {
  resolvers: {
    Query: {
      transaction: async (root, { txid }) => {
        var data = await transaction.getTransaction(txid);

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
        } else if (args.height != null) {
          data = await block.getBlockByHeight(args.height);
        }

        var transactions = [];
        for (i = 0; i < data.tx.length; i++) {
          var tx_data = await transaction.getTransaction(data.tx[i]);
          transactions.push(tx_data);
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
        

        var blocks = await blockchain.getBlocks(args.offset, args.limit);

        return {
          chain: data.chain,
          difficulty: data.difficulty,
          mediantime: data.mediantime,
          chainwork: data.chainwork,
          blocks: [...blocks]
        }
      }
    }
  }
};