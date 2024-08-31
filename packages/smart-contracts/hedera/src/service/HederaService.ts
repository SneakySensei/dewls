import {
  Client,
  ContractCreateFlow,
  ContractId,
  FileCreateTransaction,
} from "@hashgraph/sdk";
import "dotenv/config";

export class HederaService {
  private static operatorId: string = process.env.OPERATOR_ID!;
  private static operatorKey: string = process.env.OPERATOR_KEY!;
  private static client: Client;
  private static byteCodeFileId: string;
  public static contractId: ContractId;

  public static init() {
    if (!this.operatorId || !this.operatorKey) {
      throw new Error("OPERATOR_ID and OPERATOR_KEY must be provided");
    }
    this.client = Client.forTestnet();
    console.log("Client: ", this.operatorId, this.operatorKey);
    this.client.setOperator(this.operatorId, this.operatorKey);
  }

  public static async createByteCodeFile(byteCode: string): Promise<string> {
    try {
      const transactionId = new FileCreateTransaction().setContents(
        byteCode.toString()
      );

      const txnId = await transactionId.execute(this.client);
      console.log("Transaction ID: ");

      const receipt = await txnId.getReceipt(this.client);
      console.log("File ID: " + receipt.fileId!.toString());
      this.byteCodeFileId = receipt.fileId!.toString();
      return this.byteCodeFileId;
    } catch (error: any) {
      console.log(error);
      throw new Error(`Error creating byte code file: ${error.message}`);
    }
  }

  public static async deployContract(bytecode: string): Promise<ContractId> {
    const byteCodeArray = new Uint8Array(bytecode.split(",").map(Number));
    const deployTxnId = await new ContractCreateFlow()
      .setBytecode(byteCodeArray)
      .setGas(100_000_000_000)
      .execute(this.client);

    const receipt = await deployTxnId.getReceipt(this.client);
    this.contractId = receipt.contractId!;
    return this.contractId;
  }
}
