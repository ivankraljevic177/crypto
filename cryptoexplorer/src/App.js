import React, { useEffect, useState } from "react";
import axios from "axios";

import styles from "./App.module.css";

function App() {
  const [blockCount, setBlockCount] = useState();

  const [hash, setHash] = useState();
  const [hashResult, setHashResult] = useState();

  const [txid, setTxId] = useState();
  const [txResult, setTxResult] = useState();

  const [size, setSize] = useState();
  const [blockSizeResult, setBlockSizeResult] = useState();

  const handleChangeHash = (event) => {
    event.preventDefault();
    setHash(event.target.value);
  };

  const handleChangeHashSize = (event) => {
    event.preventDefault();
    setSize(event.target.value);
  };

  const handleChangeTxId = (event) => {
    event.preventDefault();
    setTxId(event.target.value);
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

  useEffect(() => {
    const getBlockCount = async () => {
      try {
        const response = await axios.get(`/blockCount`);
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
      <span>Block count:{blockCount}</span>
      <span className={styles.hashBox}>
        <p className={styles.hashTitle}>Search block by hash:</p>
        <input className={styles.hashInput} onChange={handleChangeHash} />
        <button className={styles.button} onClick={fetchBlockByHash}>
          Search
        </button>
      </span>

      <span className={styles.hashBox}>
        <p className={styles.hashTitle}>Search block by height:</p>
        <input
          type="number"
          className={styles.hashInput}
          onChange={handleChangeHashSize}
        />
        <button className={styles.button} onClick={fetchBlockBySize}>
          Search
        </button>
      </span>

      <span className={styles.hashBox}>
        <p className={styles.hashTitle}>Search transaction by ID:</p>
        <input className={styles.hashInput} onChange={handleChangeTxId} />
        <button className={styles.button} onClick={fetchTransaction}>
          Search
        </button>
      </span>

      <div className={styles.resultsBox}>
        <p>Results:</p>
        <div className={styles.hashResult}>
          <p> BLOCK BY HASH:</p>
          <pre>{JSON.stringify(hashResult, null, 4)}</pre>
        </div>
        <div className={styles.hashResult}>
          <p> BLOCK BY HEIGHT:</p>
          <pre>{JSON.stringify(blockSizeResult, null, 4)}</pre>
        </div>
        <div className={styles.hashResult}>
          <p> TRANSACTION:</p>
          <pre>{JSON.stringify(txResult, null, 4)}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
