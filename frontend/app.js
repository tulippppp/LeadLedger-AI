const SHARDEUM_TESTNET = {
  chainId: "0x1FB7",
  chainName: "Shardeum Mezame (Testnet)",
  nativeCurrency: { name: "SHM", symbol: "SHM", decimals: 18 },
  rpcUrls: ["https://api-mezame.shardeum.org"],
  blockExplorerUrls: ["https://explorer-mezame.shardeum.org"],
};

const EXPLORER_BASE = "https://explorer-mezame.shardeum.org";
const MODEL_VERSION = "LeadLedger-KNN-v1.4";
const DEFAULT_CONTRACT_ADDRESS = window.LEADLEDGER_DEFAULT_CONTRACT || "";
const STORAGE_KEYS = {
  contractAddress: "leadledger-contract-address",
  txHistory: "leadledger-tx-history",
};

const CONTRACT_ABI = [
  {
    type: "function",
    name: "logBatch",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "inputs",
        type: "tuple[]",
        components: [
          { name: "leadId", type: "string" },
          { name: "company", type: "string" },
          { name: "contactName", type: "string" },
          { name: "classification", type: "string" },
          { name: "assignedQueue", type: "string" },
          { name: "actionLabel", type: "string" },
          { name: "leadHash", type: "bytes32" },
          { name: "decisionHash", type: "bytes32" },
          { name: "batchHash", type: "bytes32" },
          { name: "confidenceBps", type: "uint16" },
          { name: "manualSecondsSaved", type: "uint32" },
          { name: "modelVersion", type: "string" },
        ],
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "getDashboardTotals",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { name: "decisionCount", type: "uint256" },
      { name: "manualSecondsSaved", type: "uint256" },
      { name: "isPaused", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "getLatestDecisionIds",
    stateMutability: "view",
    inputs: [{ name: "count", type: "uint256" }],
    outputs: [{ name: "ids", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "getDecision",
    stateMutability: "view",
    inputs: [{ name: "decisionId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "leadId", type: "string" },
          { name: "company", type: "string" },
          { name: "contactName", type: "string" },
          { name: "classification", type: "string" },
          { name: "assignedQueue", type: "string" },
          { name: "actionLabel", type: "string" },
          { name: "leadHash", type: "bytes32" },
          { name: "decisionHash", type: "bytes32" },
          { name: "batchHash", type: "bytes32" },
          { name: "confidenceBps", type: "uint16" },
          { name: "manualSecondsSaved", type: "uint32" },
          { name: "modelVersion", type: "string" },
          { name: "actor", type: "address" },
          { name: "createdAt", type: "uint64" },
        ],
      },
    ],
  },
  {
    type: "event",
    name: "DecisionLogged",
    anonymous: false,
    inputs: [
      { indexed: true, name: "decisionId", type: "uint256" },
      { indexed: true, name: "batchHash", type: "bytes32" },
      { indexed: true, name: "actor", type: "address" },
      { indexed: false, name: "leadId", type: "string" },
      { indexed: false, name: "classification", type: "string" },
      { indexed: false, name: "assignedQueue", type: "string" },
      { indexed: false, name: "leadHash", type: "bytes32" },
      { indexed: false, name: "decisionHash", type: "bytes32" },
      { indexed: false, name: "confidenceBps", type: "uint16" },
      { indexed: false, name: "manualSecondsSaved", type: "uint32" },
    ],
  },
];

const DEMO_LEADS = [
  {
    id: "LD-101",
    company: "NovaStack",
    contactName: "Avery Chen",
    role: "VP Revenue Operations",
    employees: 84,
    sector: "B2B SaaS",
    source: "Founder referral",
    region: "US",
    seats: 65,
    message:
      "We want to automate inbound demo routing before next quarter. Can you share pricing, Salesforce integration details, and a fast pilot path? We'd like to decide this week.",
  },
  {
    id: "LD-102",
    company: "FluxFleet",
    contactName: "Riley Hart",
    role: "Head of Revenue",
    employees: 210,
    sector: "Logistics Tech",
    source: "Website demo request",
    region: "EU",
    seats: 130,
    message:
      "Your workflow looks relevant for our SDR pod. We need procurement-friendly pricing, security review material, and a rollout plan for 100+ seats this month.",
  },
  {
    id: "LD-103",
    company: "CareLoop",
    contactName: "Jordan Silva",
    role: "Customer Success Manager",
    employees: 38,
    sector: "HealthTech",
    source: "Community webinar",
    region: "India",
    seats: 18,
    message:
      "We're exploring ways to route customer questions faster. I'd like to understand use cases and whether we can try this with a small success team before budgeting next month.",
  },
  {
    id: "LD-104",
    company: "PatchDesk",
    contactName: "Maya Patel",
    role: "Operations Lead",
    employees: 26,
    sector: "FinTech",
    source: "Partner intro",
    region: "UAE",
    seats: 22,
    message:
      "We're comparing tools for triaging inbound requests. Can you send a short walkthrough and examples of how early-stage teams use the platform? No procurement process yet.",
  },
  {
    id: "LD-105",
    company: "DriftAI",
    contactName: "Noah Reyes",
    role: "Founder",
    employees: 14,
    sector: "AI Infra",
    source: "Investor intro",
    region: "US",
    seats: 11,
    message:
      "We need an ops copilot for our GTM team before the next launch. If pricing makes sense, we can move fast. Happy to do a founder call tomorrow and start a pilot right away.",
  },
  {
    id: "LD-106",
    company: "LocalMint",
    contactName: "Priya Menon",
    role: "Growth Associate",
    employees: 9,
    sector: "Consumer Commerce",
    source: "Organic website chat",
    region: "India",
    seats: 4,
    message:
      "Just looking around for ideas. Is there a free tier or open-source option? We may revisit this later once our team scales.",
  },
];

const TRAINING_EXAMPLES = [
  { label: "Hot", queue: "Founder Desk", probability: 95, vector: [9.8, 8.9, 9.1, 9.2, 8.4, 9.3] },
  { label: "Hot", queue: "Founder Desk", probability: 91, vector: [9.2, 8.4, 8.4, 9.5, 7.8, 9.6] },
  { label: "Hot", queue: "SDR Pod", probability: 88, vector: [8.8, 8.2, 7.8, 8.6, 8.7, 8.4] },
  { label: "Hot", queue: "SDR Pod", probability: 86, vector: [8.4, 7.6, 8.7, 7.8, 9.1, 8.1] },
  { label: "Warm", queue: "Growth Ops", probability: 72, vector: [6.6, 5.8, 5.4, 6.5, 7.3, 6.2] },
  { label: "Warm", queue: "SDR Pod", probability: 68, vector: [6.9, 5.1, 5.9, 6.9, 6.7, 6.8] },
  { label: "Warm", queue: "CS Inbox", probability: 64, vector: [5.7, 5.4, 4.3, 5.2, 6.8, 5.8] },
  { label: "Warm", queue: "Growth Ops", probability: 61, vector: [5.9, 4.8, 4.9, 5.7, 6.2, 5.3] },
  { label: "Cold", queue: "Nurture Queue", probability: 38, vector: [3.5, 2.8, 2.6, 3.4, 4.8, 4.6] },
  { label: "Cold", queue: "Nurture Queue", probability: 32, vector: [2.4, 2.2, 2.1, 3.1, 4.1, 4.5] },
  { label: "Cold", queue: "CS Inbox", probability: 28, vector: [2.9, 2.5, 1.8, 3.8, 3.4, 4.1] },
  { label: "Cold", queue: "Nurture Queue", probability: 25, vector: [2.1, 1.9, 1.5, 2.7, 3.8, 3.6] },
];

const SOURCE_SCORES = {
  "Founder referral": 9.4,
  "Investor intro": 9.8,
  "Partner intro": 8.4,
  "Website demo request": 8.1,
  "Community webinar": 6.2,
  "Organic website chat": 4.7,
};

const SECTOR_SCORES = {
  "B2B SaaS": 9.2,
  "AI Infra": 8.8,
  "FinTech": 8.2,
  "HealthTech": 7.4,
  "Logistics Tech": 7.8,
  "Consumer Commerce": 5.6,
};

const AUTHORITY_RULES = [
  { match: /founder|ceo|chief/i, score: 9.8 },
  { match: /vp|head/i, score: 8.8 },
  { match: /director/i, score: 7.8 },
  { match: /manager|lead/i, score: 6.7 },
  { match: /associate|coordinator/i, score: 4.5 },
];

const SIGNAL_KEYWORDS = {
  intent: [
    "pricing",
    "pilot",
    "demo",
    "security review",
    "procurement",
    "salesforce",
    "integration",
    "rollout",
    "contract",
  ],
  urgency: ["this week", "this month", "tomorrow", "right away", "next quarter", "launch", "move fast"],
  budget: ["pricing", "budget", "procurement", "paid", "quote", "contract"],
  fit: ["ops", "routing", "triage", "inbound", "workflow", "automation", "gtm", "customer questions"],
};

const state = {
  readProvider: null,
  provider: null,
  signer: null,
  contract: null,
  account: null,
  balance: "0.0000",
  chainId: null,
  contractAddress: localStorage.getItem(STORAGE_KEYS.contractAddress) || DEFAULT_CONTRACT_ADDRESS,
  processed: new Map(),
  previewBatchHash: "",
  selectedLeadId: DEMO_LEADS[0].id,
  txHistory: readStoredJson(STORAGE_KEYS.txHistory, []),
  chainRecords: [],
  chainTotals: { decisionCount: 0, manualSecondsSaved: 0, paused: false },
};

const els = {};
let hasInitialized = false;

function bootApp() {
  if (hasInitialized) {
    return;
  }

  hasInitialized = true;

  try {
    init();
  } catch (error) {
    console.error(error);
    const statusEl = document.getElementById("statusRibbon");
    if (statusEl) {
      statusEl.textContent = `App bootstrap failed: ${error.message || error}`;
      statusEl.className = "status-ribbon status-error";
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootApp);
} else {
  bootApp();
}

function init() {
  cacheElements();
  bindEvents();

  try {
    state.readProvider = new ethers.JsonRpcProvider(SHARDEUM_TESTNET.rpcUrls[0]);
  } catch (_error) {
    state.readProvider = null;
  }

  els.contractAddress.value = state.contractAddress;

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => window.location.reload());
    window.ethereum.on("chainChanged", () => window.location.reload());
  }

  renderAll();
  if (state.contractAddress && state.readProvider) {
    state.contract = new ethers.Contract(state.contractAddress, CONTRACT_ABI, state.readProvider);
    refreshChainSnapshot();
  } else if (state.contractAddress) {
    setContractStatus("Stored contract address ready. Connect wallet to refresh the chain snapshot.");
  }
}

function cacheElements() {
  [
    "addNetworkBtn",
    "connectBtn",
    "processAllBtn",
    "anchorBatchBtn",
    "resetBtn",
    "statusRibbon",
    "heroHotLead",
    "heroHotLeadMeta",
    "heroProofCount",
    "processedCount",
    "hotCount",
    "hoursSaved",
    "chainCount",
    "networkPill",
    "walletAddress",
    "walletBalance",
    "chainDecisionCount",
    "chainTimeSaved",
    "contractAddress",
    "loadContractBtn",
    "refreshChainBtn",
    "contractStatus",
    "batchHashLabel",
    "decisionHashLabel",
    "leadList",
    "decisionDetail",
    "selectedLeadBadge",
    "txHistory",
    "chainRecords",
    "txCounter",
    "chainSnapshotCount",
    "inboxCounter",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els.connectBtn.addEventListener("click", connectWallet);
  els.addNetworkBtn.addEventListener("click", addShardeumNetwork);
  els.processAllBtn.addEventListener("click", processAllLeads);
  els.anchorBatchBtn.addEventListener("click", () => anchorProcessedBatch());
  els.resetBtn.addEventListener("click", resetWorkspace);
  els.loadContractBtn.addEventListener("click", loadContract);
  els.refreshChainBtn.addEventListener("click", refreshChainSnapshot);

  els.leadList.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const leadId = button.dataset.leadId;
    const action = button.dataset.action;

    if (action === "analyze") {
      analyzeLead(leadId);
      return;
    }

    if (action === "focus") {
      state.selectedLeadId = leadId;
      renderDecisionDetail();
      renderLeadList();
      return;
    }

    if (action === "anchor") {
      await anchorProcessedBatch([leadId]);
    }
  });

  els.decisionDetail.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const leadId = button.dataset.leadId || state.selectedLeadId;

    if (action === "analyze") {
      analyzeLead(leadId);
      return;
    }

    if (action === "anchor-one") {
      await anchorProcessedBatch([leadId]);
      return;
    }

    if (action === "anchor-all") {
      await anchorProcessedBatch();
    }
  });
}

async function connectWallet() {
  if (!window.ethereum) {
    setStatus("MetaMask was not detected. Install MetaMask to connect the dashboard.", "error");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    state.provider = new ethers.BrowserProvider(window.ethereum);
    state.signer = await state.provider.getSigner();
    state.account = await state.signer.getAddress();

    const network = await state.provider.getNetwork();
    state.chainId = Number(network.chainId);

    const balance = await state.provider.getBalance(state.account);
    state.balance = Number.parseFloat(ethers.formatEther(balance)).toFixed(4);

    if (state.contractAddress) {
      state.contract = new ethers.Contract(state.contractAddress, CONTRACT_ABI, state.signer);
      await refreshChainSnapshot();
    }

    setStatus("Wallet connected. You can now load the contract and anchor AI decisions on Shardeum.", "success");
    renderAll();
  } catch (error) {
    setStatus(error.message || "Wallet connection failed.", "error");
  }
}

async function addShardeumNetwork() {
  if (!window.ethereum) {
    setStatus("MetaMask was not detected. Install MetaMask to add the Shardeum network.", "error");
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [SHARDEUM_TESTNET],
    });
    setStatus("Shardeum testnet was added to MetaMask.", "success");
  } catch (error) {
    setStatus(error.message || "Failed to add the Shardeum network.", "error");
  }
}

async function loadContract() {
  const address = els.contractAddress.value.trim();
  if (!ethers.isAddress(address)) {
    setContractStatus("Enter a valid contract address.", true);
    return;
  }

  state.contractAddress = address;
  localStorage.setItem(STORAGE_KEYS.contractAddress, address);
  const runner = state.signer || state.provider || state.readProvider;

  if (!runner) {
    setContractStatus("Connect your wallet to read and write the Shardeum contract.", true);
    return;
  }

  state.contract = new ethers.Contract(address, CONTRACT_ABI, runner);

  await refreshChainSnapshot();
  setContractStatus(`Contract loaded: ${formatHash(address)}`);
  renderAll();
}

async function refreshChainSnapshot() {
  if (!state.contract) {
    setContractStatus("Load a deployed LeadAutomationLedger contract to view on-chain activity.", true);
    return;
  }

  try {
    const totals = await state.contract.getDashboardTotals();
    state.chainTotals = {
      decisionCount: Number(totals.decisionCount ?? totals[0]),
      manualSecondsSaved: Number(totals.manualSecondsSaved ?? totals[1]),
      paused: Boolean(totals.isPaused ?? totals[2]),
    };

    const readCount = Math.min(state.chainTotals.decisionCount, 5);
    state.chainRecords = [];

    if (readCount > 0) {
      const ids = await state.contract.getLatestDecisionIds(readCount);
      for (const id of ids) {
        const record = await state.contract.getDecision(id);
        state.chainRecords.push(mapChainRecord(record));
      }
    }

    setContractStatus(
      state.chainTotals.paused
        ? "Contract loaded, but logging is paused by the owner."
        : "Chain snapshot refreshed from Shardeum."
    );
    renderAll();
  } catch (error) {
    setContractStatus(error.message || "Unable to read the contract snapshot.", true);
  }
}

function processAllLeads() {
  DEMO_LEADS.forEach((lead) => {
    state.processed.set(lead.id, buildDecision(lead));
  });

  const topHotLead = [...state.processed.values()].sort(sortDecisions)[0];
  state.selectedLeadId = topHotLead ? topHotLead.leadId : DEMO_LEADS[0].id;
  syncPreviewBatchHash();
  setStatus("Demo inbox processed. Review the decisions, then anchor the batch on-chain.", "success");
  renderAll();
}

function analyzeLead(leadId) {
  const lead = DEMO_LEADS.find((item) => item.id === leadId);
  if (!lead) return;

  state.processed.set(leadId, buildDecision(lead));
  state.selectedLeadId = leadId;
  syncPreviewBatchHash();
  setStatus(`${lead.company} was analyzed. The decision trace is ready.`, "success");
  renderAll();
}

function buildDecision(lead) {
  const features = scoreLeadFeatures(lead);
  const matches = rankTrainingMatches(features.vector).slice(0, 5);
  const labelWeights = new Map();
  const queueWeights = new Map();

  let weightedProbability = 0;
  let totalWeight = 0;
  let avgDistance = 0;

  matches.forEach((match) => {
    labelWeights.set(match.label, (labelWeights.get(match.label) || 0) + match.weight);
    queueWeights.set(match.queue, (queueWeights.get(match.queue) || 0) + match.weight);
    weightedProbability += match.probability * match.weight;
    avgDistance += match.distance;
    totalWeight += match.weight;
  });

  const classification = pickHighestWeight(labelWeights);
  let assignedQueue = pickHighestWeight(queueWeights);

  if (classification === "Hot" && features.authority.score >= 8.5) {
    assignedQueue = "Founder Desk";
  } else if (classification === "Warm" && /customer|support/i.test(lead.message)) {
    assignedQueue = "CS Inbox";
  } else if (classification === "Cold") {
    assignedQueue = "Nurture Queue";
  }

  const probability = weightedProbability / totalWeight;
  const closeness = Math.max(0, 1 - avgDistance / matches.length / 10);
  const voteMargin = (labelWeights.get(classification) || 0) / totalWeight;
  const confidenceBps = clamp(
    Math.round((probability * 0.52 + closeness * 100 * 0.28 + voteMargin * 100 * 0.2) * 100),
    5200,
    9800
  );

  const priority = derivePriority(classification, features);
  const actionLabel = recommendAction(classification, assignedQueue, features);
  const manualSecondsSaved = classification === "Hot" ? 540 : classification === "Warm" ? 360 : 240;
  const leadHash = hashText(
    stableSerialize({
      leadId: lead.id,
      company: lead.company,
      contactName: lead.contactName,
      message: lead.message,
      source: lead.source,
      sector: lead.sector,
      seats: lead.seats,
    })
  );

  const decisionPayload = {
    leadId: lead.id,
    classification,
    assignedQueue,
    actionLabel,
    confidenceBps,
    manualSecondsSaved,
    modelVersion: MODEL_VERSION,
    featureSummary: features.summary,
  };
  const decisionHash = hashText(stableSerialize(decisionPayload));

  return {
    leadId: lead.id,
    company: lead.company,
    contactName: lead.contactName,
    role: lead.role,
    employees: lead.employees,
    sector: lead.sector,
    source: lead.source,
    message: lead.message,
    classification,
    assignedQueue,
    actionLabel,
    probability,
    confidenceBps,
    priority,
    manualSecondsSaved,
    leadHash,
    decisionHash,
    modelVersion: MODEL_VERSION,
    replyDraft: buildReplyDraft(lead, classification, actionLabel),
    reasons: buildReasons(features, lead, classification),
    features: [
      features.intent,
      features.urgency,
      features.budget,
      features.authority,
      features.fit,
      features.sourceScore,
    ],
    matches,
    anchoredProofs: [],
  };
}

function scoreLeadFeatures(lead) {
  const message = lead.message.toLowerCase();

  const intentHits = countKeywordHits(message, SIGNAL_KEYWORDS.intent);
  const urgencyHits = countKeywordHits(message, SIGNAL_KEYWORDS.urgency);
  const budgetHits = countKeywordHits(message, SIGNAL_KEYWORDS.budget);
  const fitHits = countKeywordHits(message, SIGNAL_KEYWORDS.fit);

  const intent = clamp(4.4 + intentHits * 1.25 + lead.seats / 40, 1, 10);
  const urgency = clamp(2.8 + urgencyHits * 1.8 + (/this week|tomorrow|right away/.test(message) ? 1.2 : 0), 1, 10);
  const budget = clamp(2.7 + budgetHits * 1.7 + (lead.seats > 40 ? 1.3 : 0), 1, 10);
  const authority = AUTHORITY_RULES.find((rule) => rule.match.test(lead.role))?.score || 5.2;
  const fit = clamp((SECTOR_SCORES[lead.sector] || 6) * 0.65 + fitHits * 0.55 + scoreCompanySize(lead.employees), 1, 10);
  const sourceScore = clamp(SOURCE_SCORES[lead.source] || 5.4, 1, 10);

  return {
    vector: [intent, urgency, budget, authority, fit, sourceScore],
    summary: {
      intent: round(intent),
      urgency: round(urgency),
      budget: round(budget),
      authority: round(authority),
      fit: round(fit),
      sourceScore: round(sourceScore),
    },
    intent: { name: "Buyer intent", score: intent, detail: "Pricing, pilot, integration, or demo intent in the message." },
    urgency: { name: "Urgency", score: urgency, detail: "Timeline pressure and language indicating near-term action." },
    budget: { name: "Budget readiness", score: budget, detail: "Procurement, paid rollout, and pricing readiness signals." },
    authority: { name: "Buyer authority", score: authority, detail: "Seniority and expected purchasing power of the contact." },
    fit: { name: "ICP fit", score: fit, detail: "Sector relevance, team size, and workflow alignment." },
    sourceScore: { name: "Source quality", score: sourceScore, detail: "How strong the acquisition source is historically." },
  };
}

function rankTrainingMatches(vector) {
  return TRAINING_EXAMPLES.map((sample) => {
    const distance = Math.sqrt(
      sample.vector.reduce((sum, value, index) => {
        const delta = value - vector[index];
        return sum + delta * delta;
      }, 0)
    );

    return {
      ...sample,
      distance,
      weight: 1 / (distance + 0.55),
    };
  }).sort((left, right) => left.distance - right.distance);
}

async function anchorProcessedBatch(leadIds = null) {
  if (!state.contract || !state.signer) {
    setStatus("Connect your wallet and load the deployed contract before anchoring a batch.", "error");
    return;
  }

  if (state.chainId !== 8119) {
    setStatus("Switch MetaMask to Shardeum testnet before sending the transaction.", "error");
    return;
  }

  const decisions = getProcessedDecisions(leadIds);
  if (!decisions.length) {
    setStatus("Process at least one lead before anchoring it on-chain.", "error");
    return;
  }

  const batchHash = computeBatchHash(decisions);
  const payload = decisions.map((decision) => buildContractInput(decision, batchHash));

  try {
    setStatus(`Submitting ${payload.length} decision${payload.length > 1 ? "s" : ""} to Shardeum...`);
    const tx = await state.contract.logBatch(payload);
    setStatus("Transaction submitted. Waiting for Shardeum confirmation...");
    const receipt = await tx.wait();

    const proofEntries = parseDecisionEvents(receipt).map((entry) => ({
      ...entry,
      txHash: receipt.hash,
      explorerUrl: `${EXPLORER_BASE}/tx/${receipt.hash}`,
      anchoredAt: new Date().toISOString(),
    }));

    proofEntries.forEach((proof) => {
      const decision = state.processed.get(proof.leadId);
      if (decision) {
        decision.anchoredProofs = [...decision.anchoredProofs, proof];
      }
    });

    state.txHistory.unshift({
      txHash: receipt.hash,
      explorerUrl: `${EXPLORER_BASE}/tx/${receipt.hash}`,
      batchHash,
      decisionCount: payload.length,
      manualSecondsSaved: decisions.reduce((sum, decision) => sum + decision.manualSecondsSaved, 0),
      companies: decisions.map((decision) => decision.company),
      anchoredAt: new Date().toISOString(),
    });

    persistJson(STORAGE_KEYS.txHistory, state.txHistory);
    await refreshChainSnapshot();
    setStatus(`Batch anchored successfully. Tx: ${formatHash(receipt.hash)}`, "success");
    renderAll();
  } catch (error) {
    setStatus(error.reason || error.message || "Failed to anchor the batch on-chain.", "error");
  }
}

function buildContractInput(decision, batchHash) {
  return {
    leadId: decision.leadId,
    company: decision.company,
    contactName: decision.contactName,
    classification: decision.classification,
    assignedQueue: decision.assignedQueue,
    actionLabel: decision.actionLabel,
    leadHash: decision.leadHash,
    decisionHash: decision.decisionHash,
    batchHash,
    confidenceBps: decision.confidenceBps,
    manualSecondsSaved: decision.manualSecondsSaved,
    modelVersion: decision.modelVersion,
  };
}

function parseDecisionEvents(receipt) {
  const entries = [];

  receipt.logs.forEach((log) => {
    try {
      const parsed = state.contract.interface.parseLog(log);
      if (parsed.name === "DecisionLogged") {
        entries.push({
          decisionId: Number(parsed.args.decisionId),
          batchHash: parsed.args.batchHash,
          actor: parsed.args.actor,
          leadId: parsed.args.leadId,
          classification: parsed.args.classification,
          assignedQueue: parsed.args.assignedQueue,
          leadHash: parsed.args.leadHash,
          decisionHash: parsed.args.decisionHash,
          confidenceBps: Number(parsed.args.confidenceBps),
          manualSecondsSaved: Number(parsed.args.manualSecondsSaved),
        });
      }
    } catch (_error) {
      return null;
    }
  });

  return entries;
}

function getProcessedDecisions(leadIds = null) {
  const selectedIds = leadIds ? new Set(leadIds) : null;
  return [...state.processed.values()]
    .filter((decision) => (selectedIds ? selectedIds.has(decision.leadId) : true))
    .sort(sortDecisions);
}

function syncPreviewBatchHash() {
  const decisions = getProcessedDecisions();
  state.previewBatchHash = decisions.length ? computeBatchHash(decisions) : "";
}

function computeBatchHash(decisions) {
  return hashText(decisions.map((decision) => decision.decisionHash).join("|"));
}

function mapChainRecord(record) {
  return {
    id: Number(record.id ?? record[0]),
    leadId: record.leadId ?? record[1],
    company: record.company ?? record[2],
    contactName: record.contactName ?? record[3],
    classification: record.classification ?? record[4],
    assignedQueue: record.assignedQueue ?? record[5],
    actionLabel: record.actionLabel ?? record[6],
    leadHash: record.leadHash ?? record[7],
    decisionHash: record.decisionHash ?? record[8],
    batchHash: record.batchHash ?? record[9],
    confidenceBps: Number(record.confidenceBps ?? record[10]),
    manualSecondsSaved: Number(record.manualSecondsSaved ?? record[11]),
    modelVersion: record.modelVersion ?? record[12],
    actor: record.actor ?? record[13],
    createdAt: Number(record.createdAt ?? record[14]),
  };
}

function renderAll() {
  renderWallet();
  renderStats();
  renderLeadList();
  renderDecisionDetail();
  renderTxHistory();
  renderChainRecords();
}

function renderWallet() {
  els.walletAddress.textContent = state.account ? formatHash(state.account) : "Not connected";
  els.walletBalance.textContent = `${state.balance} SHM`;
  els.chainDecisionCount.textContent = state.chainTotals.decisionCount;
  els.chainTimeSaved.textContent = `${Math.round(state.chainTotals.manualSecondsSaved / 60)}m`;
  els.chainCount.textContent = state.chainTotals.decisionCount || countAnchoredDecisions();
  els.heroProofCount.textContent = `${countAnchoredDecisions()} records anchored`;
  els.networkPill.textContent =
    state.account && state.chainId === 8119
      ? "Connected to Shardeum testnet"
      : state.account
        ? `Connected to chain ${state.chainId}`
        : "Wallet not connected";
  els.connectBtn.textContent = state.account ? "Wallet Connected" : "Connect Wallet";
  els.addNetworkBtn.style.display = state.account && state.chainId === 8119 ? "none" : "inline-flex";
}

function renderStats() {
  const decisions = getProcessedDecisions();
  const hotDecisions = decisions.filter((decision) => decision.classification === "Hot");
  const hoursSaved = decisions.reduce((sum, decision) => sum + decision.manualSecondsSaved, 0) / 3600;
  const topLead = decisions.sort(sortDecisions)[0];

  els.processedCount.textContent = decisions.length;
  els.hotCount.textContent = hotDecisions.length;
  els.hoursSaved.textContent = `${hoursSaved.toFixed(1)}h`;
  els.heroHotLead.textContent = topLead ? `${topLead.company} is the top-priority lead` : "Analyze the queue";
  els.heroHotLeadMeta.textContent = topLead
    ? `${topLead.classification} | ${topLead.assignedQueue} | ${formatPercent(topLead.confidenceBps)} confidence`
    : "Lead scoring will highlight the strongest buyer intent.";
  els.batchHashLabel.textContent = state.previewBatchHash ? formatHash(state.previewBatchHash) : "Pending analysis";

  const selected = state.processed.get(state.selectedLeadId);
  els.decisionHashLabel.textContent = selected ? formatHash(selected.decisionHash) : "Select a processed lead";
}

function renderLeadList() {
  els.inboxCounter.textContent = `${DEMO_LEADS.length} demo leads`;

  els.leadList.innerHTML = DEMO_LEADS.map((lead) => {
    const decision = state.processed.get(lead.id);
    const classification = decision?.classification;
    const chipClass =
      classification === "Hot" ? "chip-hot" : classification === "Warm" ? "chip-warm" : "chip-cold";

    return `
      <article class="lead-card ${state.selectedLeadId === lead.id ? "is-selected" : ""}">
        <div class="lead-top">
          <div>
            <div class="lead-title">${lead.company}</div>
            <div class="lead-subtitle">${lead.contactName} · ${lead.role}</div>
          </div>
          <div class="panel-counter">${lead.source}</div>
        </div>

        <p class="lead-message">${lead.message}</p>

        <div class="chip-row">
          <span class="chip">${lead.employees} employees</span>
          <span class="chip">${lead.sector}</span>
          <span class="chip">${lead.seats} seats</span>
          ${
            decision
              ? `<span class="chip ${chipClass}">${decision.classification} · ${formatPercent(decision.confidenceBps)}</span>`
              : ""
          }
        </div>

        <div class="card-actions" style="margin-top:16px;">
          <button class="secondary-btn small-btn" data-action="analyze" data-lead-id="${lead.id}">
            ${decision ? "Re-run analysis" : "Analyze lead"}
          </button>
          <button class="ghost-btn small-btn" data-action="focus" data-lead-id="${lead.id}">
            ${decision ? "Open trace" : "Preview"}
          </button>
          ${
            decision
              ? `<button class="ghost-btn small-btn" data-action="anchor" data-lead-id="${lead.id}">Anchor this lead</button>`
              : ""
          }
        </div>
      </article>
    `;
  }).join("");
}

function renderDecisionDetail() {
  const decision = state.processed.get(state.selectedLeadId);
  const lead = DEMO_LEADS.find((item) => item.id === state.selectedLeadId) || DEMO_LEADS[0];

  els.selectedLeadBadge.textContent = decision ? `${decision.company} selected` : `${lead.company} selected`;

  if (!decision) {
    els.decisionDetail.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>Pick a lead and run the model</h3>
          <p>
            LeadLedger AI will classify the lead, explain the score, recommend the route, draft the reply,
            and prepare the audit payload for Shardeum.
          </p>
          <button class="primary-btn" data-action="analyze" data-lead-id="${lead.id}">Analyze ${lead.company}</button>
        </div>
      </div>
    `;
    return;
  }

  const badgeClass =
    decision.classification === "Hot"
      ? "badge-hot"
      : decision.classification === "Warm"
        ? "badge-warm"
        : "badge-cold";

  const latestProof = decision.anchoredProofs[decision.anchoredProofs.length - 1];

  els.decisionDetail.innerHTML = `
    <div class="decision-shell">
      <div class="detail-top">
        <div>
          <div class="detail-title">${decision.company}</div>
          <div class="detail-subtitle">${decision.contactName} · ${decision.role}</div>
        </div>
        <div class="priority-badge ${badgeClass}">
          ${decision.priority.label} · ${decision.classification}
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <span>Assigned queue</span>
          <strong>${decision.assignedQueue}</strong>
        </div>
        <div class="summary-card">
          <span>Confidence</span>
          <strong>${formatPercent(decision.confidenceBps)}</strong>
        </div>
        <div class="summary-card">
          <span>Time saved</span>
          <strong>${formatDuration(decision.manualSecondsSaved)}</strong>
        </div>
      </div>

      <p class="detail-copy">${decision.actionLabel}</p>

      <div class="reason-row">
        ${decision.reasons.map((reason) => `<span class="reason-chip">${reason}</span>`).join("")}
      </div>

      <div class="feature-grid">
        ${decision.features
          .map(
            (feature) => `
              <div class="feature-card">
                <strong>
                  <span>${feature.name}</span>
                  <span>${round(feature.score)}/10</span>
                </strong>
                <div class="meter-track"><div class="meter-fill" style="width:${feature.score * 10}%"></div></div>
                <p>${feature.detail}</p>
              </div>
            `
          )
          .join("")}
      </div>

      <div>
        <div class="section-tag">Suggested first response</div>
        <div class="reply-block">${decision.replyDraft}</div>
      </div>

      <div class="proof-grid">
        <div class="proof-box">
          <span>Lead hash</span>
          <strong><code>${decision.leadHash}</code></strong>
        </div>
        <div class="proof-box">
          <span>Decision hash</span>
          <strong><code>${decision.decisionHash}</code></strong>
        </div>
        <div class="proof-box">
          <span>Latest batch hash</span>
          <strong><code>${latestProof ? latestProof.batchHash : state.previewBatchHash || "Pending"}</code></strong>
        </div>
      </div>

      <div class="decision-actions">
        <button class="secondary-btn" data-action="anchor-one" data-lead-id="${decision.leadId}">Anchor this lead</button>
        <button class="ghost-btn" data-action="anchor-all">Anchor processed batch</button>
        ${
          latestProof
            ? `<a class="ghost-btn" href="${latestProof.explorerUrl}" target="_blank" rel="noreferrer">Open tx</a>`
            : ""
        }
      </div>
    </div>
  `;
}

function renderTxHistory() {
  els.txCounter.textContent = `${state.txHistory.length} batch${state.txHistory.length === 1 ? "" : "es"}`;

  if (!state.txHistory.length) {
    els.txHistory.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>No anchored batches yet</h3>
          <p>Once you log a batch to Shardeum, the transaction history and explorer links will appear here.</p>
        </div>
      </div>
    `;
    return;
  }

  els.txHistory.innerHTML = state.txHistory.map((entry) => `
    <article class="tx-card">
      <div class="tx-top">
        <div>
          <div class="tx-title">${entry.decisionCount} decisions anchored</div>
          <div class="tx-meta">${entry.companies.join(", ")}</div>
        </div>
        <div class="panel-counter">${formatDate(entry.anchoredAt)}</div>
      </div>
      <div class="chip-row">
        <span class="chip">${formatDuration(entry.manualSecondsSaved)} saved</span>
        <span class="chip">${formatHash(entry.batchHash)}</span>
      </div>
      <p class="muted"><code>${entry.txHash}</code></p>
      <a href="${entry.explorerUrl}" target="_blank" rel="noreferrer">View on Shardeum explorer</a>
    </article>
  `).join("");
}

function renderChainRecords() {
  els.chainSnapshotCount.textContent = `${state.chainRecords.length} record${state.chainRecords.length === 1 ? "" : "s"}`;

  if (!state.chainRecords.length) {
    els.chainRecords.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>Load the deployed contract</h3>
          <p>The dashboard will query the latest on-chain decision records once the contract address is connected.</p>
        </div>
      </div>
    `;
    return;
  }

  els.chainRecords.innerHTML = state.chainRecords.map((record) => `
    <article class="chain-card">
      <div class="chain-top">
        <div>
          <div class="chain-title">#${record.id} · ${record.company}</div>
          <div class="chain-meta">${record.contactName} · ${record.assignedQueue}</div>
        </div>
        <div class="panel-counter">${record.classification}</div>
      </div>
      <div class="chip-row">
        <span class="chip">${formatPercent(record.confidenceBps)}</span>
        <span class="chip">${formatDuration(record.manualSecondsSaved)} saved</span>
        <span class="chip">${record.modelVersion}</span>
      </div>
      <p class="muted"><code>${record.batchHash}</code></p>
    </article>
  `).join("");
}

function resetWorkspace() {
  state.processed.clear();
  state.previewBatchHash = "";
  state.selectedLeadId = DEMO_LEADS[0].id;
  setStatus("Demo workspace reset. The on-chain transaction history remains for audit context.");
  renderAll();
}

function setStatus(message, type = "") {
  els.statusRibbon.textContent = message;
  els.statusRibbon.className = `status-ribbon ${type ? `status-${type}` : ""}`.trim();
}

function setContractStatus(message, isError = false) {
  els.contractStatus.textContent = message;
  els.contractStatus.style.color = isError ? "var(--red)" : "var(--ink-muted)";
}

function countAnchoredDecisions() {
  return state.txHistory.reduce((sum, entry) => sum + entry.decisionCount, 0);
}

function buildReasons(features, lead, classification) {
  const reasons = [];

  if (features.intent.score >= 8) reasons.push("High buyer intent");
  if (features.urgency.score >= 7) reasons.push("Near-term rollout timing");
  if (features.budget.score >= 7) reasons.push("Budget or procurement readiness");
  if (features.authority.score >= 8.5) reasons.push("Senior buyer involvement");
  if (features.fit.score >= 7.5) reasons.push("Strong ICP fit");
  if (features.sourceScore.score >= 8) reasons.push("High-trust acquisition source");

  if (classification === "Cold" && /free|open-source|later/.test(lead.message.toLowerCase())) {
    reasons.push("Low immediate buying urgency");
  }

  return reasons.slice(0, 4);
}

function buildReplyDraft(lead, classification, actionLabel) {
  if (classification === "Hot") {
    return `Hi ${lead.contactName},\n\nThanks for reaching out. Based on your timeline and rollout scope, the fastest next step is a focused working session so we can cover pricing, integrations, and a launch-ready pilot plan.\n\nRecommended next step: ${actionLabel}.\n\nIf you share two preferred times, we'll prepare a tailored walkthrough for ${lead.company}.`;
  }

  if (classification === "Warm") {
    return `Hi ${lead.contactName},\n\nThanks for the context. ${lead.company} looks like a strong fit for an initial workflow automation rollout, and we can keep the first phase lightweight.\n\nRecommended next step: ${actionLabel}.\n\nI'll send a focused overview with relevant examples so your team can review before the next call.`;
  }

  return `Hi ${lead.contactName},\n\nThanks for checking out LeadLedger AI. It sounds like the timing may be early, so the best next step is a low-friction follow-up with examples and ROI benchmarks you can revisit later.\n\nRecommended next step: ${actionLabel}.\n\nWhen your team is ready, we can help map the first automation workflow for ${lead.company}.`;
}

function recommendAction(classification, assignedQueue, features) {
  if (classification === "Hot" && assignedQueue === "Founder Desk") {
    return "Schedule founder demo within 30 minutes";
  }
  if (classification === "Hot") {
    return "Send pricing pack and secure an SDR call today";
  }
  if (classification === "Warm" && assignedQueue === "CS Inbox") {
    return "Share customer support workflow examples and book discovery";
  }
  if (classification === "Warm") {
    return "Send tailored ROI deck and book an SDR call";
  }
  if (features.intent.score >= 4.5) {
    return "Place in nurture sequence with a case-study follow-up";
  }
  return "Send low-touch nurture reply and revisit in 30 days";
}

function derivePriority(classification, features) {
  if (classification === "Hot" && features.urgency.score >= 7) {
    return { label: "P1", note: "Immediate response required" };
  }
  if (classification === "Hot" || classification === "Warm") {
    return { label: "P2", note: "Respond within the day" };
  }
  return { label: "P3", note: "Nurture and revisit later" };
}

function sortDecisions(left, right) {
  const priorityRank = { P1: 3, P2: 2, P3: 1 };
  const leftRank = priorityRank[left.priority.label];
  const rightRank = priorityRank[right.priority.label];

  if (leftRank !== rightRank) {
    return rightRank - leftRank;
  }

  return right.confidenceBps - left.confidenceBps;
}

function scoreCompanySize(employees) {
  if (employees >= 30 && employees <= 180) return 3.2;
  if (employees > 180) return 2.6;
  if (employees >= 10) return 2.2;
  return 1.1;
}

function countKeywordHits(message, keywords) {
  return keywords.reduce((count, keyword) => count + (message.includes(keyword) ? 1 : 0), 0);
}

function pickHighestWeight(weightMap) {
  return [...weightMap.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] || "Warm";
}

function formatPercent(confidenceBps) {
  return `${(confidenceBps / 100).toFixed(1)}%`;
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining}s`;
}

function formatHash(hash) {
  if (!hash) return "—";
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function hashText(value) {
  return ethers.keccak256(ethers.toUtf8Bytes(value));
}

function stableSerialize(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value) {
  return Number(value.toFixed(1));
}

function persistJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readStoredJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
}
