const hre = require("hardhat");

function hashText(value) {
  return hre.ethers.keccak256(hre.ethers.toUtf8Bytes(value));
}

function buildDemoInputs() {
  const batchHash = hashText(`demo-batch:${Date.now()}`);

  return [
    {
      leadId: "LD-201",
      company: "DriftOps",
      contactName: "Taylor Brooks",
      classification: "Hot",
      assignedQueue: "Founder Desk",
      actionLabel: "Schedule founder demo within 30 minutes",
      leadHash: hashText("lead:LD-201"),
      decisionHash: hashText("decision:LD-201"),
      batchHash,
      confidenceBps: 9300,
      manualSecondsSaved: 540,
      modelVersion: "LeadLedger-KNN-v1.4",
    },
    {
      leadId: "LD-202",
      company: "CareLoop",
      contactName: "Jordan Silva",
      classification: "Warm",
      assignedQueue: "SDR Pod",
      actionLabel: "Send tailored ROI deck and book an SDR call",
      leadHash: hashText("lead:LD-202"),
      decisionHash: hashText("decision:LD-202"),
      batchHash,
      confidenceBps: 7900,
      manualSecondsSaved: 360,
      modelVersion: "LeadLedger-KNN-v1.4",
    },
  ];
}

async function main() {
  const address = process.env.LEAD_LEDGER_ADDRESS;
  if (!address) {
    console.error("Set LEAD_LEDGER_ADDRESS in your .env file first.");
    process.exit(1);
  }

  const [signer] = await hre.ethers.getSigners();
  const ledger = await hre.ethers.getContractAt("LeadAutomationLedger", address, signer);

  console.log(`Using account: ${signer.address}`);
  console.log(`Ledger:        ${address}`);

  if (process.env.LOG_DEMO === "true") {
    console.log("\nLogging demo automation batch...");
    const tx = await ledger.logBatch(buildDemoInputs());
    console.log(`  Submitted: ${tx.hash}`);
    await tx.wait();
    console.log("  Confirmed.");
  }

  const [decisionCount, manualSecondsSaved, paused] = await ledger.getDashboardTotals();
  console.log("\n── Lead Ledger Snapshot ─────────────────────────");
  console.log(`Decisions logged: ${decisionCount}`);
  console.log(`Time saved:       ${(Number(manualSecondsSaved) / 60).toFixed(1)} minutes`);
  console.log(`Paused:           ${paused}`);

  if (decisionCount > 0n) {
    const latestCount = Number(decisionCount > 3n ? 3n : decisionCount);
    const latestIds = await ledger.getLatestDecisionIds(latestCount);
    console.log("\nLatest decisions:");

    for (const id of latestIds) {
      const record = await ledger.getDecision(id);
      console.log(
        `  #${record.id} ${record.company} -> ${record.classification} | ${record.assignedQueue} | ${Number(record.confidenceBps) / 100}%`
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
