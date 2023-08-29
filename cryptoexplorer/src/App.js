import React, { useEffect, useState } from "react";
import axios from "axios";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./App.module.css";

function App() {
  const [blockCount, setBlockCount] = useState();

  const [hash, setHash] = useState();
  const [hashResult, setHashResult] = useState();

  const [txid, setTxId] = useState();
  const [txResult, setTxResult] = useState();

  const [size, setSize] = useState();
  const [blockSizeResult, setBlockSizeResult] = useState();
  const [feeResult, setFeeResult] = useState();

  console.log("TX: ", txResult);

  const handleInputChange = (event) => {
    event.preventDefault();
    setFeeResult(null);

    if (
      event.target.value.length > 0 &&
      event.target.value.substring(0, 10) === "0000000000"
    ) {
      console.log("hash");
      setHash(event.target.value);
      setTxId(null);
      setSize(null);
    } else if (!isNaN(event.target.value) && event.target.value.length > 0) {
      console.log("size");
      setSize(event.target.value);
      setTxId(null);
      setHash(null);
    } else if (event.target.value.length > 10) {
      console.log("tx");
      setTxId(event.target.value);
      setHash(null);
      setSize(null);
    } else {
      setHash(null);
      setSize(null);
      setTxId(null);
    }
  };

  const handleSearchClick = () => {
    if (hash) {
      fetchBlockByHash(hash);
    } else if (size) {
      fetchBlockBySize(size);
    } else if (txid) {
      fetchTransaction(txid);
    }
  };

  const fetchBlockBySize = async () => {
    try {
      const response = await axios.get(`/blockSize/${size}`);
      setBlockSizeResult(response.data);
    } catch (error) {
      alert("Dogodila se greška, pogledaj konzolu");
      console.log(error);
    }
  };

  const fetchBlockByHash = async () => {
    try {
      const response = await axios.get(`/block/${hash}`);
      setHashResult(response.data);
    } catch (error) {
      alert("Dogodila se greška, pogledaj konzolu");
      console.log(error);
    }
  };

  const fetchTransaction = async () => {
    try {
      const response = await axios.get(`/transaction/${txid}`);
      setTxResult(response.data);
    } catch (error) {
      alert("Dogodila se greška, pogledaj konzolu");
      console.log(error);
    }
  };

  const getFeeByTransaction = async () => {
    try {
      const response = await axios.get(`/fee/${txid}`);
      setFeeResult(response.data);
    } catch (error) {
      alert("Dogodila se greška, pogledaj konzolu");
      console.log(error);
    }
  };

  useEffect(() => {
    const getBlockCount = async () => {
      try {
        const response = await axios.get(`/info`);
        setBlockCount(response.data);
      } catch (error) {
        alert("Dogodila se greška, pogledaj konzolu");
        console.log(error);
      }
    };

    getBlockCount();
  }, [hash]);

  return (
    <div className={styles.container}>
      <p className={styles.title}>Block explorer</p>
      <span>
        <p className={styles.blockInfoTitle}>Block info:</p>
        <span className={styles.blockInfo}>
          {blockCount && (
            <>
              <Typography marginRight={1}>Chain: {blockCount.chain}</Typography>
              <Typography marginRight={1}>
                Blocks: {blockCount.blocks}
              </Typography>
              <Typography marginRight={1}>
                Difficulty: {blockCount.difficulty}
              </Typography>
              <Typography marginRight={1}>
                Size on disk: {blockCount.size_on_disk}
              </Typography>
              <Typography marginRight={1}>
                Best block hash: {blockCount.bestblockhash}
              </Typography>
            </>
          )}
        </span>
      </span>

      <span className={styles.hashBox}>
        <p className={styles.hashTitle}>Search blockchain:</p>
        <input
          placeholder="Hash, height or ID"
          className={styles.hashInput}
          onChange={handleInputChange}
        />
        <Button
          color="primary"
          className={styles.button}
          onClick={handleSearchClick}
        >
          <SearchIcon />
          Search
        </Button>
      </span>

      <div className={styles.resultsBox}>
        <p>Results:</p>
        <div className={styles.hashResult}>
          <Accordion className={styles.hashAcordion} expanded={!!hashResult}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>BLOCK BY HASH:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {hashResult && (
                <>
                  <Typography variant="h6">HASH:</Typography>
                  <Typography paddingBottom={1}>{hashResult.hash}</Typography>
                  <Typography variant="h6">HEIGHT:</Typography>
                  <Typography paddingBottom={1}>{hashResult.height}</Typography>
                  <Typography variant="h6">TIME:</Typography>
                  <Typography paddingBottom={1}>{hashResult.time}</Typography>
                  <Typography variant="h6">WEIGHT:</Typography>
                  <Typography paddingBottom={1}>{hashResult.weight}</Typography>
                  <Typography variant="h6">SIZE:</Typography>
                  <Typography paddingBottom={1}>{hashResult.size}</Typography>
                  <Typography variant="h6">CONFIRMATIONS:</Typography>
                  <Typography paddingBottom={1}>
                    {hashResult.confirmations}
                  </Typography>
                  <Typography variant="h6">NONCE:</Typography>
                  <Typography paddingBottom={1}>{hashResult.nonce}</Typography>
                  <Typography variant="h6">TX:</Typography>
                  <Box display="flex" flexDirection="column">
                    {hashResult.tx.map((id) => (
                      <Typography key={id}>{id}</Typography>
                    ))}
                  </Box>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
        <div className={styles.heightResult}>
          <Accordion
            className={styles.heightAcordion}
            expanded={!!blockSizeResult}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>BLOCK BY HEIGHT:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {blockSizeResult && (
                <>
                  <Typography variant="h6">HASH:</Typography>
                  <Typography paddingBottom={1}>
                    {blockSizeResult.hash}
                  </Typography>
                  <Typography variant="h6">HEIGHT:</Typography>
                  <Typography paddingBottom={1}>
                    {blockSizeResult.height}
                  </Typography>
                  <Typography variant="h6">TIME:</Typography>
                  <Typography paddingBottom={1}>
                    {blockSizeResult.time}
                  </Typography>
                  <Typography variant="h6">WEIGHT:</Typography>
                  <Typography paddingBottom={1}>
                    {blockSizeResult.weight}
                  </Typography>
                  <Typography variant="h6">SIZE:</Typography>
                  <Typography paddingBottom={1}>
                    {blockSizeResult.size}
                  </Typography>
                  <Typography variant="h6">CONFIRMATIONS:</Typography>
                  <Typography paddingBottom={1}>
                    {blockSizeResult.confirmations}
                  </Typography>
                  <Typography variant="h6">NONCE:</Typography>
                  <Typography paddingBottom={1}>
                    {blockSizeResult.nonce}
                  </Typography>
                  <Typography variant="h6">TX:</Typography>
                  <Box display="flex" flexDirection="column">
                    {blockSizeResult.tx.map((id) => (
                      <Typography key={id}>{id}</Typography>
                    ))}
                  </Box>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        </div>
        <div className={styles.transactionResult}>
          <Accordion
            className={styles.transactionAcordion}
            expanded={!!txResult}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>TRANSACTION:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" alignItems="center">
                {txid && (
                  <Button variant="contained" onClick={getFeeByTransaction}>
                    Get fee
                  </Button>
                )}
                {feeResult && (
                  <>
                    <Typography marginLeft={2}>FEE:</Typography>
                    <Typography marginLeft={1}>{feeResult}</Typography>
                  </>
                )}
              </Box>

              <AccordionDetails>
                {txResult && (
                  <>
                    <Typography variant="h6">HASH:</Typography>
                    <Typography paddingBottom={1}>{txResult.hash}</Typography>
                    <Typography variant="h6">LOCKTIME:</Typography>
                    <Typography paddingBottom={1}>
                      {txResult.locktime}
                    </Typography>
                    <Typography variant="h6">SIZE:</Typography>
                    <Typography paddingBottom={1}>{txResult.size}</Typography>
                    <Typography variant="h6">TXID:</Typography>
                    <Typography paddingBottom={1}>{txResult.txid}</Typography>
                    <Typography variant="h6">VERSION:</Typography>
                    <Typography paddingBottom={1}>
                      {txResult.version}
                    </Typography>
                    <Typography variant="h6">VSIZE:</Typography>
                    <Typography paddingBottom={1}>{txResult.vsize}</Typography>
                    <Typography variant="h6">WEIGHT:</Typography>
                    <Typography paddingBottom={1}>{txResult.weight}</Typography>
                    <Typography variant="h6">vIN:</Typography>
                    <Box
                      display="flex"
                      flexDirection="column"
                      paddingBottom={1}
                    >
                      {txResult.vin.map((v) => (
                        <Box key={v.coinbase || v.txid}>
                          {v.coinbase && (
                            <Box>
                              <Typography>Coinbase:</Typography>
                              <Typography marginBottom={1}>
                                {v.coinbase}
                              </Typography>
                            </Box>
                          )}
                          {v.txid && (
                            <Box>
                              <Typography>TXID:</Typography>
                              <Typography marginBottom={1}>{v.txid}</Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>

                    <Typography variant="h6">vOUT:</Typography>
                    <Box display="flex" flexDirection="column">
                      {txResult.vout.map((v) => (
                        <Box display="flex" marginBottom={1} key={v.n}>
                          <Typography>n:</Typography>
                          <Typography marginLeft={1} marginRight={1}>
                            {v.n}
                          </Typography>
                          <Typography>value:</Typography>
                          <Typography marginLeft={1} marginRight={1}>
                            {v.value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </AccordionDetails>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default App;
