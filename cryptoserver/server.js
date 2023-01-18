const express = require("express");
const app = express();
const bitcoin = require("bitcoin-core");

const client = new bitcoin({
  host: "blockchain.oss.unist.hr",
  port: "8332",
  username: "student",
  password: "IhIskjGukNz9bRpWJL0FBNXmlSBd1pS5AtJdG1zfavLaICBuP4VDPEPMu67ql7U3",
});

client.getBlockchainInfo().then((help) => console.log(help));

app.get("/blockCount", function (req, res) {
  client
    .getBlockCount()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error);
    });
});

app.get("/block/:hash", function (req, res) {
  client
    .getBlock(req.params.hash)
    .then((block) => {
      res.json(block);
    })
    .catch((error) => {
      res.json(error);
    });
});

app.get("/blockSize/:size", function (req, res) {
  client
    .getBlockHash(parseInt(req.params.size))
    .then((blockHash) => {
      client
        .getBlock(blockHash)
        .then((block) => {
          res.json(block);
        })
        .catch((error) => {
          res.json(error);
        });
    })
    .catch((error) => {
      res.json(error);
    });
});

app.get("/transaction/:txid", function (req, res) {
  client
    .getRawTransaction(req.params.txid)
    .then((transaction) => {
      client
        .decodeRawTransaction(transaction)
        .then((response) => {
          res.json(response);
        })
        .catch((error) => {
          res.json(error);
        });
    })
    .catch((error) => {
      res.json(error);
    });
});

app.listen(4000, function () {
  console.log("Example app listening on port 4000!");
});

const headers = {
  "content-type": "text/plain;",
};

module.exports = app;
