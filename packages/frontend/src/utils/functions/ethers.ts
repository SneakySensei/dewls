import { IProvider } from "@web3auth/base";
import { Contracts } from "common";
import { ethers } from "ethers";
import { createWalletClient, custom, WalletClient } from "viem";
import { sepolia } from "viem/chains";

export const getWalletClient = async (
    provider: IProvider,
): Promise<WalletClient> => {
    const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(provider),
    });

    return walletClient;
};

export const getWalletAddress = async (
    provider: IProvider,
): Promise<string> => {
    const walletClient = new ethers.BrowserProvider(provider);
    const walletAddress = (await walletClient.provider.getSigner()).address;

    return walletAddress;
};

export const getTokenBalance = async (
    provider: IProvider,
    walletAddress: string,
    tokenAddress: string,
): Promise<{
    token_balance: string;
    native_balance: string;
}> => {
    const walletClient = new ethers.BrowserProvider(provider);
    const contract = new ethers.Contract(
        tokenAddress,
        Contracts.ERC_20_ABI,
        walletClient.provider,
    );
    const balance = await contract.balanceOf(walletAddress);
    const native_balance = await walletClient.getBalance(walletAddress);

    return {
        token_balance: (Number(balance) / Math.pow(10, 6))
            .toFixed(2)
            .toString(),
        native_balance: (Number(native_balance) / Math.pow(10, 18))
            .toFixed(4)
            .toString(),
    };
};
