# LeadLedger AI

LeadLedger AI is a lightweight startup operations copilot that automates one of the most repetitive early-stage workflows: inbound lead triage.

It classifies leads, prioritizes follow-up, drafts the first response, estimates time saved, and anchors every automated decision to the **Shardeum** blockchain for transparency, traceability, and tamper-resistant auditability.

## Why this can win

- **Real startup pain point:** founders and small GTM teams lose hours every week manually sorting inbound leads.
- **Explainable AI/ML:** a lightweight KNN-style scoring engine turns lead text + metadata into transparent Hot/Warm/Cold decisions.
- **Strong blockchain fit:** every automation output is logged on-chain as an auditable decision record with hashes, confidence, and batch provenance.
- **High demo value:** polished UI, measurable time-saved metrics, visible reasoning, and Shardeum explorer links.

## What the product does

LeadLedger AI automates a simple but high-value startup task:

1. Read inbound lead messages from a demo lead inbox.
2. Extract intent, urgency, authority, budget, fit, and source signals.
3. Score and classify each lead as `Hot`, `Warm`, or `Cold`.
4. Recommend the best queue and next action.
5. Generate a ready-to-send reply draft.
6. Log the decision batch on **Shardeum** with hashes and model metadata.

## Core features

- Wallet-connected Shardeum dashboard
- AI lead scoring with explainable feature traces
- Batch automation for multiple inbound leads
- Confidence scoring and priority routing
- Suggested outreach copy for each lead
- On-chain decision logging via `LeadAutomationLedger`
- Audit timeline with transaction hashes and explorer links
- Time-saved analytics for hackathon storytelling

## Project structure

```text
contracts/
  LeadAutomationLedger.sol
scripts/
  deploy.js
  interact.js
frontend/
  index.html
  styles.css
  app.js
test/
  LeadAutomationLedger.test.js
```

## Smart contract design

`LeadAutomationLedger` stores:

- lead id
- company + contact
- classification
- assigned queue
- action label
- lead hash
- decision hash
- batch hash
- confidence score
- manual seconds saved
- model version
- wallet address that anchored the decision
- timestamp

It also maintains running totals for:

- total decisions logged
- total manual time saved

## AI/ML approach

This MVP uses a lightweight and explainable AI workflow suitable for a hackathon MVP:

- feature extraction from lead text and metadata
- KNN-style similarity scoring against known lead profiles
- weighted confidence estimation
- rule-backed next-action recommendation
- deterministic response drafting for reproducible outputs

This keeps the system:

- transparent
- fast
- offline-friendly
- easy to demo live

## Shardeum integration

The contract is configured for the current starter-kit defaults:

- **Shardeum testnet RPC:** `https://api-mezame.shardeum.org`
- **Chain ID:** `8119`
- **Explorer:** `https://explorer-mezame.shardeum.org`

The dashboard supports:

- connect wallet
- add/switch to Shardeum testnet
- paste deployed contract address
- log a processed batch on-chain
- inspect transaction links and ledger totals

## Local setup

### 1. Install dependencies

```bash
npm install --cache ./.npm-cache
```

### 2. Create environment file

```bash
cp .env.example .env
```

Then add:

```bash
PRIVATE_KEY=your_wallet_private_key
```

### 3. Compile

```bash
npm run compile
```

### 4. Run tests

```bash
npm test
```

### 5. Deploy to Shardeum testnet

```bash
npm run deploy
```

After deploy, copy the printed contract address.

### 6. Open the frontend

```bash
npm run serve:frontend
```

Then visit [http://localhost:8080](http://localhost:8080).

## Optional CLI interaction

Read contract totals:

```bash
LEAD_LEDGER_ADDRESS=0xYourContractAddress npm run interact
```

Log a demo batch from the CLI:

```bash
LEAD_LEDGER_ADDRESS=0xYourContractAddress LOG_DEMO=true npm run interact
```

## Demo script for judges

1. Open the dashboard and show the inbound lead queue.
2. Click **Process Demo Leads**.
3. Highlight the AI explanation, priority routing, and drafted replies.
4. Show the time-saved metric and Hot lead surfacing.
5. Connect MetaMask to Shardeum testnet.
6. Paste the deployed contract address.
7. Click **Anchor Batch On-chain**.
8. Open the Shardeum explorer transaction to prove auditability.
9. Show the on-chain totals updating in the dashboard.

## Judging criteria mapping

### Full Stack Development

- production-style smart contract
- polished dashboard UX
- wallet connection flow
- local interaction scripts and tests

### Blockchain Integration

- meaningful Shardeum usage, not just token minting
- immutable automation audit trail
- batch logging, hashes, provenance, and explorer verification

### Innovation & Impact

- clear startup use case with immediate ROI
- transparent AI decisions instead of black-box output
- measurable time savings and operational accountability

## Suggested pitch line

> "LeadLedger AI turns every inbound startup lead into an explainable decision in seconds, then proves that decision on Shardeum."
