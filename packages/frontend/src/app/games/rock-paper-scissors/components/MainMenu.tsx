import { TIERS_IDS } from "common";

type Props = {
  onJoin: (tier: TIERS_IDS, user2?: boolean) => void;
};
export default function MainMenu({ onJoin }: Props) {
  return (
    <main>
      <button onClick={() => onJoin(TIERS_IDS.ALPHA)}>Alpha ($1)</button>
      <button onClick={() => onJoin(TIERS_IDS.ALPHA, true)}>ALPHA ($1)</button>
      <button onClick={() => onJoin(TIERS_IDS.BETA)}>Beta ($3)</button>
      <button onClick={() => onJoin(TIERS_IDS.GAMMA)}>Gaama ($10)</button>
    </main>
  );
}
