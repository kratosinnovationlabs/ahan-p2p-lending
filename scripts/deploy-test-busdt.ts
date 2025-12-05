import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying Test BUSDT...');
  
  const TestBUSDT = await ethers.getContractFactory('TestBUSDT');
  const busdt = await TestBUSDT.deploy();
  
  await busdt.waitForDeployment();
  const address = await busdt.getAddress();
  
  console.log('Test BUSDT deployed to:', address);
  console.log('Save this address for your .env file');
  
  // Mint some tokens to deployer
  const [deployer] = await ethers.getSigners();
  console.log('Deployer address:', deployer.address);
  console.log('Initial balance:', await busdt.balanceOf(deployer.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
