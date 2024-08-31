import { IProvider } from "@web3auth/base";
import { createWalletClient, custom, WalletClient } from "viem";
import { sepolia } from "viem/chains";

export const getWalletClient = async (
  provider: IProvider
): Promise<WalletClient> => {
  console.log("provider", provider);
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(provider),
  });

  return walletClient;
};
