import { TIERS_IDS } from "common";

type Props = {
  onJoin: (tier: TIERS_IDS) => void;
};
export default function MainMenu({ onJoin }: Props) {
  return (
    <main className="space-y-6">
      <button onClick={() => onJoin(TIERS_IDS.ALPHA)} className="block">
        Alpha ($10)
      </button>
      <button onClick={() => onJoin(TIERS_IDS.BETA)} className="block">
        Beta ($3)
      </button>
      <button onClick={() => onJoin(TIERS_IDS.GAMMA)} className="block">
        Gaama ($1)
      </button>
      <button onClick={() => onJoin(TIERS_IDS.FREE)} className="block">
        Play for free
      </button>
    </main>
  );
}
