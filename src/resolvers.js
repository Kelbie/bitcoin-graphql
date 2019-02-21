var async = require('async');

var transaction = require("./models/transaction");
var block = require("./models/block");
var blockchain = require("./models/blockchain");

module.exports = {
  resolvers: {
    Block: {
      transactions: async (root, args, context, info) => {
        if (args.coinbaseOnly == true) {
          for (i = 0; i < root.transactions.length; i++) {
            for (j = 0; j < root.transactions[i].vins.length; j++) {
              if (root.transactions[i].vins[j].coinbase == null) {
                delete root.transactions[i]
                break;
              }
            }
          }
        }
        return root.transactions;
      }
    },
    Vout: {
      value: async (root, args, context, info) => {
        if (args.min >= root.value) {
          root.value = null;
        }
        if (root.value >= args.max) {
          root.value = null;
        }
        return root.value;
      }
    },
    Blockchain: {
      blocks: async (root, args, context, info) => {
        var blocks = await blockchain.getBlocks(args.offset, args.limit);
        return blocks;
      }
    },
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
          time: data.time,
          vouts: data.vouts,
          vins: data.vins
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