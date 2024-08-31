import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    rootstock: {
      url: "https://rpc.testnet.rootstock.io/n7we3FGsGV67FrKz47SjnmzIut15Us-T",
      accounts: [process.env.PRIVATE_KEY!],
    },
    morphl2: {
      url: "https://rpc-quicknode-holesky.morphl2.io",
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
