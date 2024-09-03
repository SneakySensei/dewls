import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { Contracts } from "common";

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: Contracts.CHAIN_CONFIG[31] },
});

const web3auth = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID!,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

export { web3auth };
