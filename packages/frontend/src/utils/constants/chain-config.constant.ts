import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";

export const CHAIN_CONFIG: { [key: number]: CustomChainConfig } = {
  296: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x128",
    rpcTarget: "https://testnet.hashio.io/api",
    displayName: "Hedera Testnet",
    blockExplorerUrl: "https://hashscan.io/testnet/",
    ticker: "HBAR",
    tickerName: "HBAR",
    logo: "https://cryptologos.cc/logos/hedera-hbar-logo.png?v=033",
  },
  2810: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xa96",
    rpcTarget: "https://rpc-testnet.morphl2.io",
    displayName: "Morph Testnet",
    blockExplorerUrl: "https://explorer-testnet.morphl2.io/",
    ticker: "ETH",
    tickerName: "ETH",
    logo: "https://morphl2brand.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Ffcab2c10-8da9-4414-aa63-4998ddf62e78%2F64fbcffc-0e7c-45e1-8900-1bb36dc90924%2FFrame_1597882262.png?table=block&id=0e6a22c3-ed4e-4c25-9575-11b95b1eade9&spaceId=fcab2c10-8da9-4414-aa63-4998ddf62e78&width=2000&userId=&cache=v2",
  },
  31: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1f",
    rpcTarget: "https://public-node.testnet.rsk.co",
    displayName: "Rootstock Testnet",
    blockExplorerUrl: "https://explorer.testnet.rootstock.io/",
    ticker: "tRBTC",
    tickerName: "tRBTC",
    logo: "https://pbs.twimg.com/profile_images/1592915327343624195/HPPSuVx3_400x400.jpg",
  },
};

export const CHAINS: Array<CustomChainConfig> = [
  {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x128",
    rpcTarget: "https://testnet.hashio.io/api",
    displayName: "Hedera Testnet",
    blockExplorerUrl: "https://hashscan.io/testnet/",
    ticker: "HBAR",
    tickerName: "HBAR",
    logo: "https://cryptologos.cc/logos/hedera-hbar-logo.png?v=033",
  },
  {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xa96",
    rpcTarget: "https://rpc-testnet.morphl2.io",
    displayName: "Morph Testnet",
    blockExplorerUrl: "https://explorer-testnet.morphl2.io/",
    ticker: "ETH",
    tickerName: "ETH",
    logo: "https://morphl2brand.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Ffcab2c10-8da9-4414-aa63-4998ddf62e78%2F64fbcffc-0e7c-45e1-8900-1bb36dc90924%2FFrame_1597882262.png?table=block&id=0e6a22c3-ed4e-4c25-9575-11b95b1eade9&spaceId=fcab2c10-8da9-4414-aa63-4998ddf62e78&width=2000&userId=&cache=v2",
  },
  {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1f",
    rpcTarget: "https://public-node.testnet.rsk.co",
    displayName: "Rootstock Testnet",
    blockExplorerUrl: "https://explorer.testnet.rootstock.io/",
    ticker: "tRBTC",
    tickerName: "tRBTC",
    logo: "https://pbs.twimg.com/profile_images/1592915327343624195/HPPSuVx3_400x400.jpg",
  },
];
