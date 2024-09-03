import { type CustomChainConfig, CHAIN_NAMESPACES } from "@web3auth/base";

export const ARCADE_ABI = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BetPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "player2",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
    ],
    name: "GameCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "gameId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "GameEnded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "OwnerWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "rewardPoolPercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ownerPercentage",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "winPercentage",
        type: "uint256",
      },
    ],
    name: "PercentagesUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RewardWithdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_player1",
        type: "address",
      },
      {
        internalType: "address",
        name: "_player2",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_betAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isBettingActive",
        type: "bool",
      },
    ],
    name: "createGame",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_winner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_loser",
        type: "address",
      },
    ],
    name: "endGame",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "gameCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "games",
    outputs: [
      {
        internalType: "address",
        name: "player1",
        type: "address",
      },
      {
        internalType: "address",
        name: "player2",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "betAmount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isBettingActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "player1Deposit",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "player2Deposit",
        type: "bool",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isGameOver",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameId",
        type: "uint256",
      },
    ],
    name: "getGameDetails",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "player1",
            type: "address",
          },
          {
            internalType: "address",
            name: "player2",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "betAmount",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isBettingActive",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "player1Deposit",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "player2Deposit",
            type: "bool",
          },
          {
            internalType: "address",
            name: "winner",
            type: "address",
          },
          {
            internalType: "bool",
            name: "isGameOver",
            type: "bool",
          },
        ],
        internalType: "struct Arcade.Game",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_gameId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardPool",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardPoolPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardPoolPercentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ownerPercentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_winPercentage",
        type: "uint256",
      },
    ],
    name: "updatePercentages",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "winPercentage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawOwnerPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_userAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdrawReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const ERC_20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address",
      },
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
      {
        name: "_spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
];

export const ARCADE_CONTRACT_ADDRESS: { [chainId: number]: string } = {
  296: "0xdD049Fc4b926A7857c012354e578c6da1c5B8316", // * INFO: Hedera
  31: "0xdD049Fc4b926A7857c012354e578c6DA1C5B8316", // * INFO: Rootstock
  2810: "0xeff531D43600A925c0D282f755bA0d39AA82EF14", // * INFO: Morph L2
};

export const TOKEN_CONTRACT_ADDRESS: { [chainId: number]: string } = {
  296: "0x24C6434B4779Cecd89075A936d11fd6Aec055166", // * INFO: Hedera
  31: "0x24C6434B4779Cecd89075A936d11fd6Aec055166", // * INFO: Rootstock
  2810: "0x9E12AD42c4E4d2acFBADE01a96446e48e6764B98", // * INFO: Morph L2
};

export const NETWORK_RPC_URL: { [chainId: number]: string } = {
  296: "0x0e76A3D0B12385a030525b4252A775b4437fFaa7", // * Hedera
  31: "0x24C6434B4779Cecd89075A936d11fd6Aec055166", // * Rootstock
  2810: "0x9E12AD42c4E4d2acFBADE01a96446e48e6764B98", // * Morph L2
};

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
    isTestnet: true,
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
    isTestnet: true,
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
    isTestnet: true,
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
    isTestnet: true,
  },
  {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xAFA",
    rpcTarget: "https://rpc-quicknode-holesky.morphl2.io",
    displayName: "Morph Testnet",
    blockExplorerUrl: "https://explorer-testnet.morphl2.io/",
    ticker: "ETH",
    tickerName: "ETH",
    logo: "/morph-l2.svg",
    isTestnet: true,
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
    isTestnet: true,
  },
];
