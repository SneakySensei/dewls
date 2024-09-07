import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ArcadeModule = buildModule("ArcadeModule", (m) => {
  const arcade = m.contract("Arcade", [
    "0x24C6434B4779Cecd89075A936d11fd6Aec055166",
  ]);

  return { arcade };
});

export default ArcadeModule;
