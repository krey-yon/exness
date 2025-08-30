"use client";

import { useEffect, useState } from "react";

type Order = {
  id: string;
  quantity: number;
  assests: string;
  currentAssetPrice: number;
  leverage: number;
  margin: number;
  stopLoss?: number;
  takeProfit?: number;
  proceeds?: number;
};

type OrdersResponse = { Long: Order[]; Short: Order[] };

async function fetchOrders(): Promise<OrdersResponse> {
  const res = await fetch("http://localhost:8000/orders", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("orders");
  return res.json();
}

async function liquidate(positionId: string, side: "Short" | "Long") {
  const res = await fetch("http://localhost:8000/liquidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ positionId, side }),
  });
  if (!res.ok) throw new Error("liquidate failed");
  return res.json();
}

function Row({
  o,
  side,
  onDone,
}: {
  o: Order;
  side: "Long" | "Short";
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto_auto] items-center gap-3 border-b border-white/5 px-2 py-2 text-sm">
      <div className="truncate text-neutral-300">{o.id}</div>
      <div>{o.assests}</div>
      <div>{o.quantity}</div>
      <div>{o.leverage}x</div>
      <div>{o.currentAssetPrice?.toFixed?.(2)}</div>
      <div>{o.stopLoss ?? "-"}</div>
      <div>{o.takeProfit ?? "-"}</div>
      <button
        disabled={busy}
        onClick={async () => {
          try {
            setBusy(true);
            await liquidate(o.id, side);
            onDone();
          } finally {
            setBusy(false);
          }
        }}
        className="rounded-md border border-amber-400/40 bg-amber-900/20 px-2 py-1 text-xs text-amber-300 hover:bg-amber-900/30 disabled:opacity-60"
      >
        Liquidate
      </button>
    </div>
  );
}

export function OrdersList() {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      const d = await fetchOrders();
      console.log(d)
      setData(d);
      setErr(null);
    } catch {
      setErr("Failed to fetch orders");
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <div className="mb-3 text-sm font-semibold text-neutral-300">
        All orders
      </div>
      {err && <div className="mb-2 text-xs text-rose-400">{err}</div>}
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="mb-2 text-xs uppercase tracking-wider text-neutral-400">
            Long
          </div>
          <div className="rounded-lg border border-white/10 bg-neutral-900/30">
            {data?.Long?.length ? (
              data.Long.map((o) => (
                <Row key={o.id} o={o} side="Long" onDone={load} />
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-neutral-400">
                No long positions
              </div>
            )}
          </div>
          <div className="mt-4 mb-2 text-xs uppercase tracking-wider text-neutral-400">
            Short
          </div>
          <div className="rounded-lg border border-white/10 bg-neutral-900/30">
            {data?.Short?.length ? (
              data.Short.map((o) => (
                <Row key={o.id} o={o} side="Short" onDone={load} />
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-neutral-400">
                No short positions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
