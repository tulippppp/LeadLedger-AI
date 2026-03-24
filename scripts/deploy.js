const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("=".repeat(50));
  console.log(`Network:  ${network}`);
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance:  ${hre.ethers.formatEther(balance)} SHM`);
  console.log("=".repeat(50));

  console.log("\n[1/1] Deploying LeadAutomationLedger...");
  const LeadAutomationLedger = await hre.ethers.getContractFactory("LeadAutomationLedger");
  const ledger = await LeadAutomationLedger.deploy();
  await ledger.waitForDeployment();
  const ledgerAddress = await ledger.getAddress();
  console.log(`  LeadAutomationLedger deployed to: ${ledgerAddress}`);

  const explorerBase =
    network === "shardeum_mainnet"
      ? "https://explorer.shardeum.org"
      : "https://explorer-mezame.shardeum.org";

  console.log("\n" + "=".repeat(50));
  console.log("Deployment complete!");
  console.log(`  Contract: ${explorerBase}/address/${ledgerAddress}`);
  console.log(`  Copy into .env as LEAD_LEDGER_ADDRESS=${ledgerAddress}`);
  console.log("  Then open frontend/index.html and paste the contract address into the dashboard.");
  console.log("=".repeat(50));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
