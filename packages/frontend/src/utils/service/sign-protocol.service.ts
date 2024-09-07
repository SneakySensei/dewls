import {
    AttestationResult,
    EvmChains,
    SignProtocolClient,
    SpMode,
} from "@ethsign/sp-sdk";
import { WalletClient } from "viem";

export default class SignClient {
    private readonly signClient: SignProtocolClient;

    constructor(walletClient: WalletClient) {
        this.signClient = new SignProtocolClient(SpMode.OnChain, {
            chain: EvmChains.sepolia,
            walletClient: walletClient,
        });
    }

    async createSchema() {
        try {
            const response = await this.signClient.createSchema({
                name: "Winner Attestation",
                data: [
                    { name: "played_game_id", type: "string" },
                    { name: "season_id", type: "string" },
                    { name: "player_id", type: "string" },
                    { name: "tier_id", type: "string" },
                ],
            });

            console.log(response);

            return response;
        } catch (e) {
            throw e;
        }
    }

    async attest({
        played_game_id,
        season_id,
        player_id,
        tier_id,
    }: {
        played_game_id: string;
        season_id: string;
        player_id: string;
        tier_id: string;
    }): Promise<AttestationResult> {
        try {
            const response = await this.signClient.createAttestation({
                schemaId: "0xa3",
                data: {
                    game_id: played_game_id,
                    season_id,
                    player_id,
                    tier_id,
                },
                indexingValue: played_game_id,
            });

            return response;
        } catch (e) {
            throw e;
        }
    }
}
