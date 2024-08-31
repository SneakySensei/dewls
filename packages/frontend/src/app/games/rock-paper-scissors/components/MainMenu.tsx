import { TIERS } from "common";

type Props = {
  onJoin: (tier: TIERS, user2?: boolean) => void;
};
export default function MainMenu({ onJoin }: Props) {
  return (
    <main>
      <button onClick={() => onJoin(TIERS.ALPHA)}>Alpha ($1)</button>
      <button onClick={() => onJoin(TIERS.ALPHA, true)}>ALPHA ($1)</button>
      <button onClick={() => onJoin(TIERS.BETA)}>Beta ($3)</button>
      <button onClick={() => onJoin(TIERS.GAAMA)}>Gaama ($10)</button>
    </main>
  );
}
