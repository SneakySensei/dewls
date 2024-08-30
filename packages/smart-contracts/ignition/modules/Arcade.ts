import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ArcadeModule = buildModule("ArcadeModule", (m) => {
  const arcade = m.contract("Arcade");

  return { arcade };
});

export default ArcadeModule;
