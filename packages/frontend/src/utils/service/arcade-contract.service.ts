import ethers from "ethers";
import { Eip1193Provider } from "ethers";
import { Contract } from "ethers";
import {
  ARCADE_ABI,
  ARCADE_CONTRACT_ADDRESS,
} from "../constants/contracts.constants";

export class ArcadeService {
  public static arcade_contract: Contract;
  public static provider: ethers.BrowserProvider;

  public static async init(provider: Eip1193Provider) {
    this.provider = new ethers.BrowserProvider(provider);
    const chain_id = await provider.request({ method: "eth_chainId" });
    this.arcade_contract = new ethers.Contract(
      ARCADE_CONTRACT_ADDRESS[chain_id],
      ARCADE_ABI,
      this.provider
    );
  }

  public static async depositBet(
    game_id: number,
    amount: number
  ): Promise<any> {
    const tx = await this.arcade_contract.depositBet(game_id, amount);
    await tx.wait();
    return tx;
  }
}
