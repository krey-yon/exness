"use client";

import { useEffect, useState } from "react"; // CHANGED: add useState
import { useMarket } from "./MarketContext";
import { useMarketData } from "./useMarketData";

function Ticker({
  label,
  buy,
  sell,
}: {
  label: string;
  buy?: number;
  sell?: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-white/10 bg-neutral-800/40 px-3 py-2 text-sm">
      <span className="text-neutral-300">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-emerald-400">
          Buy {buy !== undefined ? buy.toFixed(2) : "--"}
        </span>
        <span className="text-rose-400">
          Sell {sell !== undefined ? sell.toFixed(2) : "--"}
        </span>
      </div>
    </div>
  );
}

export function MarketStrip() {
  const prices = useMarketData();
  const { asset } = useMarket();

  // Keep the latest known price per asset to prevent undefined flicker.
  const [stable, setStable] = useState(prices);

  useEffect(() => {
    setStable((prev) => ({
      SOL: prices.SOL ?? prev.SOL,
      BTC: prices.BTC ?? prev.BTC,
      ETH: prices.ETH ?? prev.ETH,
    }));
  }, [prices]);

  useEffect(() => {
    // re-render on asset switch (no-op)
  }, [asset]);

  return (
    <div className="mt-2 flex flex-col gap-2">
      <Ticker label="SOL/USDT" buy={stable.SOL?.buy} sell={stable.SOL?.sell} />
      <Ticker label="BTC/USDT" buy={stable.BTC?.buy} sell={stable.BTC?.sell} />
      <Ticker label="ETH/USDT" buy={stable.ETH?.buy} sell={stable.ETH?.sell} />
    </div>
  );
}
