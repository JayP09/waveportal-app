import React, { useEffect,useState } from "react";
import './App.css';
import { ethers } from "ethers"; // ethers is library that helps our fronend to talk to our smart contract/

import abi from './utils/WavePortal.json';

const App = () => {
  /*Just A state variable we use to store our user's public wallet */
  const [currentAccount, setCurrentAccount] = useState("");

  const [message,setMessage] = useState("");

  /* 
  All state property to store all waves 
  */
  const [allWaves, setAllWaves] = useState([]);

  const contractAddress = "0xD2C008C1c81f161De420D12550a75D5f39ec216A";

  const contractABI = abi.abi;
  console.log(JSON.parse(process.env.REACT_APP_contractABI));

  const [totalWaveCount,setTotalWaveCount] = useState("");

  const checkIfWalletIsConnected = async () => {
    /*
    * First make sure we have access to window.ethereum
    */
   try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    /*
    Check if we are authorized to access the user's wallet
    */

    const accounts = await ethereum.request({method: 'eth_accounts'}); 
    // So, we use that special method eth_accounts to see if we're authorized to access any of the accounts in the user's wallet. One thing to keep in mind is that the user could have multiple accounts in their wallet. In this case, we just grab the first one.

    if (accounts.length !== 0){
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      getAllWaves();
    } else{
      console.log("No authorized account found")
    }
   } catch (error) {
     console.log(error);
   }
  }

  /* 
  Connect wallet method
  */
  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum){
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      console.log("Connected",accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllWaves();
    } catch (error) {
      console.log(error)
    }
  }

  /* 
  Function to call smart contract
  */
  const wave = async () => {
    try {
      const {ethereum} = window;// this will give ethereum object from window object 

      if (ethereum){
        // here, A "Provider" is what we use to actually talk to Ethereum nodes. Remember how we were using Alchemy to deploy? Well in this case we use nodes that Metamask provides in the background to send/receive data from our deployed contract.
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrived total wave count ...",count.toNumber());
        setTotalWaveCount(count.toNumber());

        /* 
        Execute the actual wave from your smart contract
        */
        if (message!==""){
        
          const waveTxn = await wavePortalContract.wave(message,{gasLimit: 300000});
          console.log("Mining...",waveTxn.hash);

          await waveTxn.wait();
          console.log("Mined --", waveTxn.hash);

          count = await wavePortalContract.getTotalWaves();
          console.log("Retrived total wave count...",count.toNumber());
          setTotalWaveCount(count.toNumber());
          getAllWaves();
          setMessage("");
        }else{
          const waveTxn = await wavePortalContract.wave("",{gasLimit: 300000});
          console.log("Mining...",waveTxn.hash);

          await waveTxn.wait();
          console.log("Mined --", waveTxn.hash);

          count = await wavePortalContract.getTotalWaves();
          console.log("Retrived total wave count...",count.toNumber());
          setTotalWaveCount(count.toNumber());
          getAllWaves();
          setMessage("");
        }
        
      }else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  /* 
  Function to count waves
  */
  const waveCounter = async () =>{
    try {
      const {ethereum} = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await wavePortalContract.getTotalWaves();
        setTotalWaveCount(count.toNumber());
      }else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  /* 
  method that gets all waves from contract
  */
  const getAllWaves = async () => {
    try {
      const {ethereum} =window ;
      
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
        /* 
        call the getAllwaves method from smart Contract
        */

        const waves = await wavePortalContract.getAllWaves();

         /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
         let wavesCleaned = [];
         waves.forEach(wave => {
           wavesCleaned.unshift({
             address: wave.waver,
             timestamp: new Date(wave.timestamp * 1000),
             message: wave.message
           });
         });

         /*
         * Store our data in React State
         */
         console.log(waves)
         setAllWaves(wavesCleaned);
      }else{
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
    waveCounter();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am Jay and This is my first web3.0 website pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>
        <textarea
        cols="30"
        rows="5"
        type="text"
        name="message"
        className="message"
        placeholder="Enter your message here!"
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        />
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} className="card">
              <div>Address : {wave.address}</div>
              <div>Time : {wave.timestamp.toString()}</div>
              <div>Message : {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App



