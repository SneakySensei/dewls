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
          { name: "game_id", type: "string" },
          { name: "season_id", type: "string" },
          { name: "user_id", type: "string" },
          { name: "tier_id", type: "string" },
          { name: "winner_id", type: "string" },
        ],
      });

      console.log(response);

      return response;
    } catch (e) {
      throw e;
    }
  }

  async attest(data: {
    game_id: string;
    season_id: string;
    user_id: string;
    tier_id: string;
    winner_id: string;
  }): Promise<AttestationResult> {
    try {
      const response = await this.signClient.createAttestation({
        schemaId: "0x92",
        data: {
          game_id: data.game_id,
          season_id: data.season_id,
          user_id: data.user_id,
          tier_id: data.tier_id,
          winner_id: data.winner_id,
        },
        indexingValue: data.game_id,
      });

      return response;
    } catch (e) {
      throw e;
    }
  }
}
