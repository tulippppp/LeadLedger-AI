// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title LeadAutomationLedger
/// @notice Stores auditable AI automation decisions for startup lead operations on Shardeum.
contract LeadAutomationLedger {
    struct DecisionInput {
        string leadId;
        string company;
        string contactName;
        string classification;
        string assignedQueue;
        string actionLabel;
        bytes32 leadHash;
        bytes32 decisionHash;
        bytes32 batchHash;
        uint16 confidenceBps;
        uint32 manualSecondsSaved;
        string modelVersion;
    }

    struct DecisionRecord {
        uint256 id;
        string leadId;
        string company;
        string contactName;
        string classification;
        string assignedQueue;
        string actionLabel;
        bytes32 leadHash;
        bytes32 decisionHash;
        bytes32 batchHash;
        uint16 confidenceBps;
        uint32 manualSecondsSaved;
        string modelVersion;
        address actor;
        uint64 createdAt;
    }

    address public owner;
    bool public paused;
    uint256 public totalDecisions;
    uint256 public totalManualSecondsSaved;

    mapping(uint256 => DecisionRecord) private decisions;
    mapping(bytes32 => uint256[]) private batchDecisionIds;

    event DecisionLogged(
        uint256 indexed decisionId,
        bytes32 indexed batchHash,
        address indexed actor,
        string leadId,
        string classification,
        string assignedQueue,
        bytes32 leadHash,
        bytes32 decisionHash,
        uint16 confidenceBps,
        uint32 manualSecondsSaved
    );

    event BatchLogged(
        bytes32 indexed batchHash,
        uint256 decisionCount,
        uint256 totalManualSecondsSaved,
        address indexed actor
    );

    event PausedSet(bool paused);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "LeadAutomationLedger: caller is not the owner");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "LeadAutomationLedger: logging is paused");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    function logBatch(DecisionInput[] calldata inputs) external whenNotPaused {
        uint256 length = inputs.length;
        require(length > 0, "LeadAutomationLedger: batch cannot be empty");
        require(length <= 50, "LeadAutomationLedger: batch too large");

        bytes32 expectedBatchHash = inputs[0].batchHash;
        require(expectedBatchHash != bytes32(0), "LeadAutomationLedger: batch hash cannot be zero");

        uint256 batchSecondsSaved;

        for (uint256 i = 0; i < length; i++) {
            DecisionInput calldata input = inputs[i];
            require(input.batchHash == expectedBatchHash, "LeadAutomationLedger: inconsistent batch hash");

            batchSecondsSaved += _storeDecision(input);
        }

        emit BatchLogged(expectedBatchHash, length, batchSecondsSaved, msg.sender);
    }

    function getDecision(uint256 decisionId) external view returns (DecisionRecord memory) {
        require(decisionId > 0 && decisionId <= totalDecisions, "LeadAutomationLedger: decision does not exist");
        return decisions[decisionId];
    }

    function getDecisionIdsForBatch(bytes32 batchHash) external view returns (uint256[] memory) {
        return batchDecisionIds[batchHash];
    }

    function getLatestDecisionIds(uint256 count) external view returns (uint256[] memory ids) {
        if (count > totalDecisions) {
            count = totalDecisions;
        }

        ids = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            ids[i] = totalDecisions - i;
        }
    }

    function getDashboardTotals() external view returns (uint256 decisionCount, uint256 manualSecondsSaved, bool isPaused) {
        return (totalDecisions, totalManualSecondsSaved, paused);
    }

    function setPaused(bool nextPaused) external onlyOwner {
        paused = nextPaused;
        emit PausedSet(nextPaused);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "LeadAutomationLedger: new owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function _storeDecision(DecisionInput calldata input) internal returns (uint32 secondsSaved) {
        require(bytes(input.leadId).length > 0, "LeadAutomationLedger: lead id is required");
        require(bytes(input.classification).length > 0, "LeadAutomationLedger: classification is required");
        require(bytes(input.assignedQueue).length > 0, "LeadAutomationLedger: assigned queue is required");
        require(bytes(input.actionLabel).length > 0, "LeadAutomationLedger: action label is required");
        require(input.leadHash != bytes32(0), "LeadAutomationLedger: lead hash cannot be zero");
        require(input.decisionHash != bytes32(0), "LeadAutomationLedger: decision hash cannot be zero");
        require(input.confidenceBps <= 10_000, "LeadAutomationLedger: confidence is out of range");

        totalDecisions += 1;
        uint256 decisionId = totalDecisions;
        secondsSaved = input.manualSecondsSaved;

        decisions[decisionId] = DecisionRecord({
            id: decisionId,
            leadId: input.leadId,
            company: input.company,
            contactName: input.contactName,
            classification: input.classification,
            assignedQueue: input.assignedQueue,
            actionLabel: input.actionLabel,
            leadHash: input.leadHash,
            decisionHash: input.decisionHash,
            batchHash: input.batchHash,
            confidenceBps: input.confidenceBps,
            manualSecondsSaved: input.manualSecondsSaved,
            modelVersion: input.modelVersion,
            actor: msg.sender,
            createdAt: uint64(block.timestamp)
        });

        totalManualSecondsSaved += input.manualSecondsSaved;
        batchDecisionIds[input.batchHash].push(decisionId);

        emit DecisionLogged(
            decisionId,
            input.batchHash,
            msg.sender,
            input.leadId,
            input.classification,
            input.assignedQueue,
            input.leadHash,
            input.decisionHash,
            input.confidenceBps,
            input.manualSecondsSaved
        );
    }
}
