import { IProvider } from "@web3auth/base";
import { Contracts } from "common";
import { ethers } from "ethers";
import { createWalletClient, custom, WalletClient } from "viem";
import { sepolia } from "viem/chains";

export const getWalletClient = async (
    provider: IProvider,
): Promise<WalletClient> => {
    console.log("provider", provider);
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
): Promise<string> => {
    const walletClient = new ethers.BrowserProvider(provider);
    const contract = new ethers.Contract(
        tokenAddress,
        Contracts.ERC_20_ABI,
        walletClient.provider,
    );
    const balance = await contract.balanceOf(walletAddress);

    return (Number(balance) / Math.pow(10, 6)).toString();
};
