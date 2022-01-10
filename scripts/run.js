
const main = async () => {
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy(
      {
        value: hre.ethers.utils.parseEther('0.1'),
      }
    ); // this will deploy the contract and fund it with 0.1 ETH .this will remove eth from your wallet and use it to fund contract

    await waveContract.deployed();
    console.log('Contract addy:', waveContract.address);
  
    /*
    * Get Contract balance
    */
    let contractBalance = await hre.ethers.provider.getBalance(
      waveContract.address
    );
    console.log(
      'Contract balance:',
      hre.ethers.utils.formatEther(contractBalance)
    );// this will check is smart contract have balance or not


    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());
  
    const waveTxn = await waveContract.wave("This is wave #1");
    await waveTxn.wait();

    const waveTxn2 = await waveContract.wave("This is wave #2");
    await waveTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Contract Balance:', hre.ethers.utils.formatEther(contractBalance));

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
  };

  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();










// Old code:

// const { hexZeroPad } = require("@ethersproject/bytes")

// const main = async () => {
//     const [owner, randomPerson] = await hre.ethers.getSigners(); // this will grabb the wallet address of contract owner and address of random person

//     const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');// this will compile our contract and generate the necessary files

//     const waveContract = await waveContractFactory.deploy(); // Hardhat will create a local Ethereum network for us, but just for this contract. Then, after the script completes it'll destroy that local network.  So, every time you run the contract, it'll be a fresh blockchain. this will makes it easy to debug errors.

//     await waveContract.deployed(); // this will delpoyed to our local blockchain Our Constructor runs when we actually deploy.

//     console.log("Contract deployed to:", waveContract.address); // here waveContract will give address of our contract

//     console.log("contract deployed by:", owner.address); //this is the address of person deploying smart contract 

//     let waveCount ;
//     waveCount = await waveContract.getTotalWaves();

//     let waveTxn = await waveContract.wave();
//     await waveTxn.wait();

//     waveCount = await waveContract.getTotalWaves();

//     // Basically, we need to manually call our functions! Just like we would any normal API. First I call the function to grab the # of total waves. Then, I do the wave. Finally, I grab the waveCount one more time to see if it changed.

//     waveTxn = await waveContract.connect(randomPerson).wave();
//     await waveTxn.wait();

//     waveCount = await waveContract.getTotalWaves();
// };

// const runMain = async () => {
//     try{
//         await main();
//         process.exit(0);
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// };

// runMain();


// // for more information read : https://app.buildspace.so/projects/CO02cf0f1c-f996-4f50-9669-cf945ca3fb0b/lessons/LEc9263031-fd3e-4af8-8f12-d366099bfe8a