const express = require("express");
const app = express();
const bitcoin = require("bitcoin-core");

const client = new bitcoin({
  host: "blockchain.oss.unist.hr",
  port: "8332",
  username: "student",
  password: "IhIskjGukNz9bRpWJL0FBNXmlSBd1pS5AtJdG1zfavLaICBuP4VDPEPMu67ql7U3",
});

app.get("/info", function (req, res) {
  client
    .getBlockchainInfo()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.json(error);
    });
});

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

app.get("/fee/:txid", async function (req, res) {
  try {
    const fee = await calculateFee(req.params.txid);

    return res.json(fee);
  } catch (error) {
    res.json(error);
  }
});

const calculateFee = async (txId) => {
  const tx = await client.getRawTransaction(txId);
  const decodedTx = await client.decodeRawTransaction(tx);

  let vinVouts = [];

  for (let i = 0; i < decodedTx.vin.length; i++) {
    if (decodedTx.vin[i].coinbase !== null) {
      continue;
    }
    vinVouts.push(decodedTx.vin[i].vout);
  }

  let vouts = 0;

  if (decodedTx.vin.length <= 0) {
    let temp = await client.getRawTransaction(decodedTx.vin[0].txid);
    let decodedTemp = await client.decodeRawTransaction(temp);

    for (let i = 0; i < vinVouts.length; i++) {
      vouts += decodedTemp.vout[vinVouts[i]].value;
    }
  }

  var voutStart = 0;
  for (let i = 0; i < decodedTx.vout.length; i++) {
    voutStart += decodedTx.vout[i].value;
  }

  if (vouts === 0) {
    return voutStart;
  } else {
    const fee = vouts - voutStart;
    return fee;
  }
};

app.listen(4000, function () {
  console.log("Example app listening on port 4000!");
});

const headers = {
  "content-type": "text/plain;",
};

module.exports = app;
