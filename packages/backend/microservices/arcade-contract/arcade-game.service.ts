import { SupabaseService } from "../../services";
import {
    ARCADE_ABI,
    ARCADE_CONTRACT_ADDRESS,
} from "../../utils/constants/contracts.constants";
import { NETWORK_RPC_URL } from "../../utils/constants/network-config.constants";
import { MappedPlayedGame, MappedUser } from "../../utils/types/mappers.types";
import { Contract, ethers } from "ethers";

export class ArcadeService {
    public static arcade_contract: Contract;
    public static provider: ethers.JsonRpcProvider;

    public static async init(chain_id: number) {
        this.provider = new ethers.JsonRpcProvider(NETWORK_RPC_URL[chain_id]);
        this.arcade_contract = new ethers.Contract(
            ARCADE_CONTRACT_ADDRESS[chain_id],
            ARCADE_ABI,
            this.provider,
        );
    }

    public static async createGame(
        game_id: MappedPlayedGame["game_id"],
        player_1_address: MappedUser["wallet_address"],
        player_2_address: MappedUser["wallet_address"],
        game_tier_id: MappedPlayedGame["game_tier_id"],
        is_betting_active: boolean,
    ) {
        try {
            const { data: game_tier_data, error: game_tier_error } =
                await SupabaseService.getSupabase()
                    .from("game_tiers")
                    .select()
                    .eq("game_tier_id", game_tier_id);

            if (game_tier_error) {
                console.error(game_tier_error);
                throw game_tier_error;
            }

            const tx = await this.arcade_contract.createGame(
                game_id,
                player_1_address,
                player_2_address,
                BigInt(game_tier_data[0].usd_amount * Math.pow(10, 6)),
                is_betting_active,
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
        winner: MappedUser["wallet_address"],
        loser: MappedUser["wallet_address"],
    ) {
        try {
            const tx = await this.arcade_contract.endGame(
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
        user_address: MappedUser["wallet_address"],
        amount: number,
    ) {
        try {
            const tx = await this.arcade_contract.withdrawReward(
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

    public static async withdrawOwnerPool() {
        try {
            const tx = await this.arcade_contract.withdrawOwnerPool();

            await tx.wait();

            return tx;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public static async updatePoolPercentages(
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

            const tx = await this.arcade_contract.updatePercentages(
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
