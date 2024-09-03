import { Contracts } from "common";
import ethers, { Contract, Eip1193Provider } from "ethers";

export class ArcadeService {
  private static provider: ethers.BrowserProvider;
  private static arcade_contract: Contract;

  public static async init(provider: Eip1193Provider) {
    this.provider = new ethers.BrowserProvider(provider);
    const chain_id = await provider.request({ method: "eth_chainId" });
    this.arcade_contract = new ethers.Contract(
      Contracts.ARCADE_CONTRACT_ADDRESS[chain_id],
      Contracts.ARCADE_ABI,
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
