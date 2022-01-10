const main = async () => {
    const [deployer] = await hre.ethers.getSigners(); // this will give address of owner
    const accountBalance = await deployer.getBalance(); // this will give account balance of owner
  
    console.log('Deploying contracts with account: ', deployer.address);
    console.log('Account balance: ', accountBalance.toString());
  
    const Token = await hre.ethers.getContractFactory('WavePortal');
    const portal = await Token.deploy({
      value: hre.ethers.utils.parseEther('0.05'),
    }); // this will deploy our smart contract and fund it with 0.05
    await portal.deployed();
  
    console.log('WavePortal address: ', portal.address);
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
  
  runMain();

  // above code is similar to run.js