import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_CONFIG } from "../constants/chain-config.constant";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig: CHAIN_CONFIG[296] },
});

const web3auth = new Web3Auth({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

export { web3auth };
