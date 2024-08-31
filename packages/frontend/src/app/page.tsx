import Card from "./components/Card";
import { ConnectModal } from "./wallet/components/ConnectModal";

export default function GameListing() {
  return (
    <main className="text-neutral-100">
      <section className="px-4">
        <section className="space-y-3 py-4">
          <ConnectModal />
          <Card />
          <Card />
          <Card />
        </section>
      </section>
    </main>
  );
}
