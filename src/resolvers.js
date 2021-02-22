var async = require("async");

var transaction = require("./models/transaction");
var block = require("./models/block");
var blockchain = require("./models/blockchain");

module.exports = {
  resolvers: {
    TransactionOrCoinbase: {
      __resolveType(obj, context, info) {
        if (obj.coinbase) {
          return "Coinbase";
        }

        if (obj.txid) {
          return "Transaction";
        }

        return null;
      }
    },
    Block: {
      transactions: async (root, args, context, info) => {
        if (args.coinbaseOnly == true) {
          for (i = 0; i < root.transactions.length; i++) {
            for (j = 0; j < root.transactions[i].vins.length; j++) {
              if (root.transactions[i].vins[j].coinbase == null) {
                delete root.transactions[i];
                break;
              }
            }
          }
        }
        return root.transactions;
      }
    },
    Blockchain: {
      blocks: async (root, args, context, info) => {
        var blocks = await blockchain.getBlocks(
          args.start_height,
          args.limit,
          args.min_weight,
          args.max_weight
        );

        return blocks;
      }
    },
    Transaction: {
      vouts: async (root, args, context, info) => {
        for (i = 0; i < root.vouts.length; i++) {
          if (args.minValue >= root.vouts[i].value) {
            delete root.vouts[i];
          }
        }
        return root.vouts;
      },
      vins: async (root, args, context, info) => {
        /* TODO: Better than defining a new array it would be better to mutate the original
         * but it kept throwing errors for some reason
         */
        let vins = [];
        for (i = 0; i < root.vins.length; i++) {
          if (root.vins[i].txid) {
            transactionVin = await transaction.getTransaction(
              root.vins[i].txid
            );
            vins.push(transactionVin);
          } else if (root.vins[i].coinbase) {
            vins.push(root.vins[i]);
          }
        }

        return vins;
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
        };
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
        };
      },
      blockchain: async (obj, args, context, info) => {
        var data = await blockchain.getBlockchainInfo();

        return {
          chain: data.chain,
          difficulty: data.difficulty,
          mediantime: data.mediantime,
          chainwork: data.chainwork
        };
      },
      getBestBlockHash: async(obj, args, context, info) => {
        let data = await blockchain.getBestBlockHash();
        return {
          hash: data
        }
      }
    }
  }
};
