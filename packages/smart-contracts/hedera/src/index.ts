import { HederaService } from "./service/HederaService";
import fs from "fs/promises";

const contractInit = async () => {
  HederaService.init();
  const evmBytecode = await fs.readFile("./src/constant/bytecode.bin", "utf-8");
  const byteCodeFileId = await HederaService.createByteCodeFile(evmBytecode);
  const contract = await HederaService.deployContract(evmBytecode);

  console.log(
    `Contract with ByteCode ID: ${contract} initialised at ${contract.toSolidityAddress()}`
  );
};

contractInit();
