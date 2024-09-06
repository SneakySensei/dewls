import { IProvider } from "@web3auth/base";
import { Contracts } from "common";
import { ethers, Contract } from "ethers";

export class ArcadeService {
    private static provider: ethers.BrowserProvider;
    private static arcade_contract: Contract;
    private static arcade_contract_address: string;
    private static token_contract: Contract;

    public static async init(
        provider: IProvider,
        chain_id: number,
    ): Promise<void> {
        try {
            console.log(chain_id);
            console.log("Initializing ArcadeService");
            console.log("Provider: ", provider);
            this.provider = new ethers.BrowserProvider(provider);
            const signer = await this.provider.getSigner();
            this.arcade_contract_address =
                Contracts.ARCADE_CONTRACT_ADDRESS[chain_id];
            this.arcade_contract = new ethers.Contract(
                Contracts.ARCADE_CONTRACT_ADDRESS[chain_id],
                Contracts.ARCADE_ABI,
                signer,
            );
            this.token_contract = new ethers.Contract(
                Contracts.TOKEN_CONTRACT_ADDRESS[chain_id],
                Contracts.ERC_20_ABI,
                signer,
            );
        } catch (error) {
            console.error(error);
        }
    }

    public static async approveBet(amount: number): Promise<any> {
        try {
            const tx = await this.token_contract.approve(
                this.arcade_contract_address,
                BigInt(amount * Math.pow(10, 6)),
            );
            await tx.wait();
            return tx;
        } catch (error) {
            console.error(error);
        }
    }

    public static async depositBet(
        game_id: string,
        amount: number,
    ): Promise<any> {
        try {
            const tx = await this.arcade_contract.placeBet(
                game_id,
                BigInt(amount * Math.pow(10, 6)),
            );
            await tx.wait();
            return tx;
        } catch (error) {
            console.error(error);
        }
    }
}
