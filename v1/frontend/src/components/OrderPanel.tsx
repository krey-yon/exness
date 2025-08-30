"use client";

import { useMarket } from "./MarketContext";
import { useMarketData } from "./useMarketData";
import { useMemo, useState } from "react";

type Payload = {
  quantity: number;
  assests: "SOL" | "BTC" | "ETH";
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
};

async function place(side: "buy" | "sell", p: Payload) {
  const url = `http://localhost:8000/order/${side}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  if (!res.ok) throw new Error("order failed");
  return res.json();
}

export function OrderPanel() {
  const { asset } = useMarket();
  const prices = useMarketData();
  const cur = prices[asset];
  const [quantity, setQuantity] = useState(1);
  const [stopLoss, setStopLoss] = useState<number | "">("");
  const [takeProfit, setTakeProfit] = useState<number | "">("");
  const [leverage, setLeverage] = useState(1);
  const [pending, setPending] = useState<"buy" | "sell" | null>(null);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const priceView = useMemo(() => ({ buy: cur?.buy, sell: cur?.sell }), [cur]);

  const submit = async (which: "buy" | "sell") => {
    try {
      setPending(which);
      const payload: Payload = {
        quantity,
        assests: asset,
        leverage,
        ...(stopLoss === "" ? {} : { stopLoss: Number(stopLoss) }),
        ...(takeProfit === "" ? {} : { takeProfit: Number(takeProfit) }),
      };
      await place(which, payload);
      // optionally toast
    } catch (e) {
      console.error(e);
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setSide("buy")}
          className={`rounded-md px-3 py-2 text-sm ${
            side === "buy"
              ? "border border-emerald-500/60 bg-emerald-900/30 text-emerald-300"
              : "border border-white/10 bg-neutral-800/40 text-neutral-300"
          }`}
        >
          Buy {priceView.buy ? priceView.buy.toFixed(2) : "--"}
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`rounded-md px-3 py-2 text-sm ${
            side === "sell"
              ? "border border-rose-500/60 bg-rose-900/30 text-rose-300"
              : "border border-white/10 bg-neutral-800/40 text-neutral-300"
          }`}
        >
          Sell {priceView.sell ? priceView.sell.toFixed(2) : "--"}
        </button>
      </div>

      <label className="text-sm text-neutral-300">Quantity</label>
      <input
        type="number"
        min={0}
        step={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="rounded-md border border-white/10 bg-neutral-800/40 px-3 py-2 outline-none"
      />

      <label className="text-sm text-neutral-300">Stop Loss</label>
      <input
        type="number"
        value={stopLoss}
        onChange={(e) =>
          setStopLoss(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="rounded-md border border-white/10 bg-neutral-800/40 px-3 py-2 outline-none"
      />

      <label className="text-sm text-neutral-300">Take Profit</label>
      <input
        type="number"
        value={takeProfit}
        onChange={(e) =>
          setTakeProfit(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="rounded-md border border-white/10 bg-neutral-800/40 px-3 py-2 outline-none"
      />

      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-neutral-300">
          <span>Leverage</span>
          <span>{leverage}x</span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={() => submit(side)}
        disabled={pending !== null}
        className="mt-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-60"
      >
        Place {side === "buy" ? "Long" : "Short"} Order
      </button>
    </div>
  );
}
