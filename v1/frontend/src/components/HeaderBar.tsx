"use client";

import { useEffect, useState } from "react";
import { useMarket } from "./MarketContext";

export function HeaderBar() {
  const { asset, setAsset } = useMarket();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8000/balance", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("balance");
        const data = await res.json();
        // allow number or {balance:number}
        const val = typeof data === "number" ? data : data.userBalance ?? null;
        if (mounted) setBalance(val.toFixed(4));
      } catch {
        if (mounted) setBalance(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 10_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3">
        <div className="text-lg font-semibold tracking-wide">Exness Trades</div>
        <div className="flex items-center gap-3">
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value as "SOL" | "BTC" | "ETH")}
            className="rounded-md border border-white/10 bg-neutral-900 px-3 py-1.5 text-sm outline-none"
          >
            <option value="SOL">SOL/USDT</option>
            <option value="BTC">BTC/USDT</option>
            <option value="ETH">ETH/USDT</option>
          </select>
          <div className="rounded-md border border-emerald-500/30 bg-emerald-900/20 px-3 py-1.5 text-sm text-emerald-300">
            {loading ? "Loading..." : `Balance: ${balance ?? "--"}`}
          </div>
        </div>
      </div>
    </header>
  );
}
