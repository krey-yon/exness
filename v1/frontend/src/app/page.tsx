import { HeaderBar } from "../components/HeaderBar";
import { MarketStrip } from "../components/MarketStrip";
import { ChartPanel } from "../components/ChartPanel";
import { OrderPanel } from "../components/OrderPanel";
import { OrdersList } from "../components/OrdersList";

export default function Home() {
  return (
    <div className="min-h-dvh w-full">
      <HeaderBar />
      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 pb-4 lg:grid-cols-[260px_minmax(0,1fr)_360px]">
        {/* Left: assets prices from WS */}
        <aside className="rounded-xl border border-white/10 bg-neutral-900/40 p-3">
          <h3 className="text-sm font-semibold text-neutral-300">Assets</h3>
          <MarketStrip />
        </aside>

        {/* Center: Chart */}
        <section className="rounded-xl border border-white/10 bg-neutral-900/40 p-3">
          <ChartPanel />
        </section>

        {/* Right: Order form */}
        <aside className="rounded-xl border border-white/10 bg-neutral-900/40 p-3">
          <OrderPanel />
        </aside>

        {/* Bottom: Orders list spans all columns */}
        <section className="lg:col-span-3 rounded-xl border border-white/10 bg-neutral-900/40 p-3">
          <OrdersList />
        </section>
      </main>
    </div>
  );
}
