import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ArcadeModule = buildModule("ArcadeModule", (m) => {
  const arcade = m.contract("Arcade", [
    "0x9E12AD42c4E4d2acFBADE01a96446e48e6764B98",
  ]);

  return { arcade };
});

export default ArcadeModule;
