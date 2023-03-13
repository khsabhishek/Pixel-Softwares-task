import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.15",
};

module.exports = {
  
  networks:{
    goerli:{
      // Ankr's Public RPC URL
      url: "https://rpc.ankr.com/eth_goerli",
     // PRIVATE_KEY loaded from .env file
      accounts: [`0x2ca37a4a54a7a40d2fcfe075c75d8c99c23c86227520bb8e396dda1814669c6e`],
      
    },
  },
  etherscan: {
    apiKey: "FBJRHAU1WSFCHVY6PXM9Q8XJ6IVVBGYINQ", // Your Etherscan API key
  },
  solidity: {
    compilers: [
      {
        version: "0.8.15",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
             details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: "dhfoDgvulfnTUtnIf"
          }
        }
          },
        },
      },]
},
  gas: 12000000,
      blockGasLimit: 0xffffffffffffff,
      allowUnlimitedContractSize: true,
     
};

export default config;
