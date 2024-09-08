import { fetchGameTier } from "../microservices/game-tiers/game-tiers.service";
import {
    MappedGameTier,
    MappedPlayedGame,
    MappedPlayer,
} from "../utils/types/mappers.types";
import { Contracts } from "common";
import { ethers } from "ethers";

export class EthersService {
    private static privateKey: string | null =
        process.env.WALLET_PRIVATE_KEY || null;

    private static config: {
        [chainId: number]: {
            wallet: ethers.Wallet;
            provider: ethers.Provider;
            contract: ethers.Contract;
        };
    } = {};

    public static async init() {
        if (!this.privateKey) {
            throw new Error("Missing environment variables.");
        }

        Object.keys(Contracts.CHAIN_CONFIG).forEach((chainId) => {
            const chainIdNum = Number(chainId);
            const provider = new ethers.JsonRpcProvider(
                Contracts.NETWORK_RPC_URL[chainIdNum],
            );

            const wallet = new ethers.Wallet(this.privateKey!, provider);
            const contract = new ethers.Contract(
                Contracts.ARCADE_CONTRACT_ADDRESS[chainIdNum],
                Contracts.ARCADE_ABI,
                wallet,
            );

            this.config[chainIdNum] = {
                contract,
                provider,
                wallet,
            };

            console.info(
                `EthersService Config created for Chain ID ${chainIdNum}`,
            );
        });

        console.info("EthersService initiated successfully!");
    }

    public static async createContractGame(
        game_id: MappedPlayedGame["game_id"],
        player_1_address: MappedPlayer["wallet_address"],
        player_2_address: MappedPlayer["wallet_address"],
        game_tier_id: MappedPlayedGame["game_tier_id"],
        chain_id: MappedPlayedGame["chain_id"],
    ) {
        try {
            const { usd_amount } = await fetchGameTier(game_tier_id);

            const tx = await this.config[chain_id].contract.createGame(
                game_id,
                player_1_address,
                player_2_address,
                BigInt(usd_amount * Math.pow(10, 6)),
                usd_amount === 0 ? false : true,
            );

            await tx.wait();

            return tx;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public static async endGame(
        game_id: MappedPlayedGame["game_id"],
        winner: MappedPlayer["wallet_address"],
        loser: MappedPlayer["wallet_address"],
        chain_id: MappedPlayedGame["chain_id"],
    ) {
        try {
            const tx = await this.config[chain_id].contract.endGame(
                game_id,
                winner,
                loser,
            );

            await tx.wait();

            return tx;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public static async withdrawUserReward(
        user_address: MappedPlayer["wallet_address"],
        chain_id: MappedPlayedGame["chain_id"],
        amount: MappedGameTier["usd_amount"],
    ) {
        try {
            const tx = await this.config[chain_id].contract.withdrawReward(
                user_address,
                BigInt(amount * Math.pow(10, 6)),
            );

            await tx.wait();

            return tx;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public static async withdrawOwnerPool(
        chain_id: MappedPlayedGame["chain_id"],
    ) {
        try {
            const tx = await this.config[chain_id].contract.withdrawOwnerPool();

            await tx.wait();

            return tx;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public static async updatePoolPercentages(
        chain_id: MappedPlayedGame["chain_id"],
        rewardPoolPercentage: number,
        ownerPoolPercentage: number,
        winnerPercentage: number,
    ) {
        try {
            if (
                rewardPoolPercentage +
                    ownerPoolPercentage +
                    winnerPercentage !==
                100
            ) {
                throw new Error("Percentages do not add up to 100");
            }

            const tx = await this.config[chain_id].contract.updatePercentages(
                rewardPoolPercentage,
                ownerPoolPercentage,
                winnerPercentage,
            );

            await tx.wait();

            return tx;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
