import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying AHAN Lending Platform contracts...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BNB\n");

  // BUSDT address on BSC Testnet
  const BUSDT_ADDRESS = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
  console.log("Using BUSDT at:", BUSDT_ADDRESS);

  // 1. Deploy LiquidBUSD
  console.log("\n📝 Deploying LiquidBUSD...");
  const LiquidBUSD = await ethers.getContractFactory("LiquidBUSD");
  const lqBUSD = await LiquidBUSD.deploy();
  await lqBUSD.waitForDeployment();
  const lqBUSDAddress = await lqBUSD.getAddress();
  console.log("✅ LiquidBUSD deployed to:", lqBUSDAddress);

  // 2. Deploy LendingPool
  console.log("\n📝 Deploying LendingPool...");
  const LendingPool = await ethers.getContractFactory("LendingPool");
  const pool = await LendingPool.deploy(BUSDT_ADDRESS, lqBUSDAddress);
  await pool.waitForDeployment();
  const poolAddress = await pool.getAddress();
  console.log("✅ LendingPool deployed to:", poolAddress);

  // 3. Transfer lqBUSD ownership to pool
  // This is CRITICAL: The pool needs to be the owner to mint/burn tokens
  console.log("\n🔐 Transferring lqBUSD ownership to pool...");
  const tx = await lqBUSD.transferOwnership(poolAddress);
  await tx.wait();
  console.log("✅ Ownership transferred");

  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("BUSDT:      ", BUSDT_ADDRESS);
  console.log("lqBUSD:     ", lqBUSDAddress);
  console.log("Pool:       ", poolAddress);
  console.log("\n📝 Update your .env file with:");
  console.log(`VITE_LQBUSD_ADDRESS=${lqBUSDAddress}`);
  console.log(`VITE_POOL_ADDRESS=${poolAddress}`);
  console.log("\n🔍 Verify contracts on BSCScan:");
  console.log(`npx hardhat verify --network bscTestnet ${lqBUSDAddress}`);
  console.log(`npx hardhat verify --network bscTestnet ${poolAddress} ${BUSDT_ADDRESS} ${lqBUSDAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
