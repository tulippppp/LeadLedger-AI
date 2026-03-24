require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
const { subtask } = require("hardhat/config");
const { TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD } = require("hardhat/builtin-tasks/task-names");

subtask(TASK_COMPILE_SOLIDITY_GET_SOLC_BUILD).setAction(async (args, _hre, runSuper) => {
  const compilerVersion = require("solc/package.json").version;

  if (args.solcVersion !== compilerVersion) {
    return runSuper(args);
  }

  return {
    compilerPath: require.resolve("solc/soljson.js"),
    isSolcJs: true,
    version: compilerVersion,
    longVersion: compilerVersion,
  };
});

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Shardeum Testnet (Mezame)
    shardeum_testnet: {
      url: process.env.SHARDEUM_TESTNET_RPC || "https://api-mezame.shardeum.org",
      chainId: 8119,
      accounts: [PRIVATE_KEY],
    },
    // Shardeum Mainnet
    shardeum_mainnet: {
      url: process.env.SHARDEUM_MAINNET_RPC || "https://api.shardeum.org",
      chainId: 8118,
      accounts: [PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
