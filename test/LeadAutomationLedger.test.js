const { expect } = require("chai");
const { ethers } = require("hardhat");

function hashText(value) {
  return ethers.keccak256(ethers.toUtf8Bytes(value));
}

function buildDecision(overrides = {}) {
  return {
    leadId: "LD-101",
    company: "NovaStack",
    contactName: "Avery Chen",
    classification: "Hot",
    assignedQueue: "Founder Desk",
    actionLabel: "Schedule founder demo within 30 minutes",
    leadHash: hashText("lead-101"),
    decisionHash: hashText("decision-101"),
    batchHash: hashText("batch-1"),
    confidenceBps: 9100,
    manualSecondsSaved: 540,
    modelVersion: "LeadLedger-KNN-v1.4",
    ...overrides,
  };
}

describe("LeadAutomationLedger", function () {
  let ledger;
  let owner;
  let other;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    const LeadAutomationLedger = await ethers.getContractFactory("LeadAutomationLedger");
    ledger = await LeadAutomationLedger.deploy();
    await ledger.waitForDeployment();
  });

  it("sets the deployer as owner", async function () {
    expect(await ledger.owner()).to.equal(owner.address);
  });

  it("logs a batch, stores records, and updates totals", async function () {
    const first = buildDecision();
    const second = buildDecision({
      leadId: "LD-102",
      company: "FluxFleet",
      contactName: "Riley Hart",
      decisionHash: hashText("decision-102"),
      leadHash: hashText("lead-102"),
      manualSecondsSaved: 360,
    });

    await expect(ledger.logBatch([first, second]))
      .to.emit(ledger, "BatchLogged")
      .withArgs(first.batchHash, 2, 900, owner.address);

    const totals = await ledger.getDashboardTotals();
    expect(totals[0]).to.equal(2);
    expect(totals[1]).to.equal(900);
    expect(totals[2]).to.equal(false);

    const record = await ledger.getDecision(1);
    expect(record.leadId).to.equal("LD-101");
    expect(record.classification).to.equal("Hot");
    expect(record.assignedQueue).to.equal("Founder Desk");
    expect(record.actor).to.equal(owner.address);

    const batchIds = await ledger.getDecisionIdsForBatch(first.batchHash);
    expect(batchIds.map((value) => Number(value))).to.deep.equal([1, 2]);
  });

  it("returns the latest decision ids in reverse order", async function () {
    await ledger.logBatch([
      buildDecision({ leadId: "LD-101", decisionHash: hashText("decision-a"), leadHash: hashText("lead-a") }),
      buildDecision({ leadId: "LD-102", decisionHash: hashText("decision-b"), leadHash: hashText("lead-b") }),
      buildDecision({ leadId: "LD-103", decisionHash: hashText("decision-c"), leadHash: hashText("lead-c") }),
    ]);

    const latest = await ledger.getLatestDecisionIds(2);
    expect(latest.map((value) => Number(value))).to.deep.equal([3, 2]);
  });

  it("rejects invalid batches", async function () {
    await expect(ledger.logBatch([])).to.be.revertedWith("LeadAutomationLedger: batch cannot be empty");

    await expect(
      ledger.logBatch([
        buildDecision({ confidenceBps: 10_001 }),
      ])
    ).to.be.revertedWith("LeadAutomationLedger: confidence is out of range");

    await expect(
      ledger.logBatch([
        buildDecision(),
        buildDecision({
          leadId: "LD-999",
          batchHash: hashText("another-batch"),
          decisionHash: hashText("decision-999"),
          leadHash: hashText("lead-999"),
        }),
      ])
    ).to.be.revertedWith("LeadAutomationLedger: inconsistent batch hash");
  });

  it("allows the owner to pause logging", async function () {
    await ledger.setPaused(true);

    const totals = await ledger.getDashboardTotals();
    expect(totals[2]).to.equal(true);

    await expect(ledger.logBatch([buildDecision()])).to.be.revertedWith(
      "LeadAutomationLedger: logging is paused"
    );
  });

  it("restricts pause and ownership transfer to the owner", async function () {
    await expect(ledger.connect(other).setPaused(true)).to.be.revertedWith(
      "LeadAutomationLedger: caller is not the owner"
    );

    await expect(ledger.connect(other).transferOwnership(other.address)).to.be.revertedWith(
      "LeadAutomationLedger: caller is not the owner"
    );

    await ledger.transferOwnership(other.address);
    expect(await ledger.owner()).to.equal(other.address);
  });
});
