import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying AHAN Lending Platform Contracts...\n");

  // Official BUSDT contract address on BSC Testnet
  const BUSDT_ADDRESS = "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee";
  
  console.log("📍 Using Official BUSDT Contract:", BUSDT_ADDRESS);
  console.log("⛓️  Network: BSC Testnet (Chain ID: 97)\n");

  // Deploy LiquidBUSD (lqBUSD)
  console.log("1️⃣ Deploying LiquidBUSD (lqBUSD)...");
  const LiquidBUSD = await ethers.getContractFactory("LiquidBUSD");
  const lqBUSD = await LiquidBUSD.deploy();
  await lqBUSD.waitForDeployment();
  const lqBUSDAddress = await lqBUSD.getAddress();
  console.log("✅ LiquidBUSD deployed to:", lqBUSDAddress);

  // Deploy AHAN Pool
  console.log("\n2️⃣ Deploying AHAN Pool...");
  const AHANPool = await ethers.getContractFactory("AHANPool");
  const pool = await AHANPool.deploy(BUSDT_ADDRESS, lqBUSDAddress);
  await pool.waitForDeployment();
  const poolAddress = await pool.getAddress();
  console.log("✅ AHAN Pool deployed to:", poolAddress);

  // Set pool contract in lqBUSD
  console.log("\n3️⃣ Configuring LiquidBUSD...");
  const tx = await lqBUSD.setPoolContract(poolAddress);
  await tx.wait();
  console.log("✅ Pool contract set in LiquidBUSD");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   BUSDT (Official):  ", BUSDT_ADDRESS);
  console.log("   LiquidBUSD (lqBUSD):", lqBUSDAddress);
  console.log("   AHAN Pool:         ", poolAddress);
  
  console.log("\n📝 Next Steps:");
  console.log("   1. Update .env file with these addresses:");
  console.log(`      VITE_BUSDT_ADDRESS=${BUSDT_ADDRESS}`);
  console.log(`      VITE_LQBUSD_ADDRESS=${lqBUSDAddress}`);
  console.log(`      VITE_POOL_ADDRESS=${poolAddress}`);
  console.log("\n   2. Verify contracts on BSCScan:");
  console.log(`      npx hardhat verify --network bscTestnet ${lqBUSDAddress}`);
  console.log(`      npx hardhat verify --network bscTestnet ${poolAddress} ${BUSDT_ADDRESS} ${lqBUSDAddress}`);
  console.log("\n   3. Get test BUSDT from faucet:");
  console.log("      https://testnet.binance.org/faucet-smart");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
