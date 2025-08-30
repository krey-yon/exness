"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AssetSymbol } from "./MarketContext";

export type PricePair = { buy: number; sell: number; ts: number };
type StreamState = Record<AssetSymbol, PricePair | undefined>;

// Robust JSON parse from text lines or noisy logs.
function safeParse(input: string): any | undefined {
  try {
    return JSON.parse(input);
  } catch {
    const i = input.indexOf("{");
    const j = input.lastIndexOf("}");
    if (i !== -1 && j !== -1 && j > i) {
      try {
        return JSON.parse(input.slice(i, j + 1));
      } catch {
        return undefined;
      }
    }
    return undefined;
  }
}

// Normalize various incoming shapes to a single update.
function normalize(
  msg: any
): { sym: AssetSymbol; buy: number; sell: number; ts: number } | undefined {
  if (!msg) return;

  // Server sends: { type: "marketdata", data: { sol_data | btc_data | eth_data } }
  let payload = msg;
  if (msg && typeof msg === "object" && "type" in msg && "data" in msg) {
    payload = (msg as any).data;
  }

  // Accept direct shapes: { sol_data: {...} } or { btc_data: {...} } or { eth_data: {...} }
  const key =
    (payload?.sol_data && "sol_data") ||
    (payload?.btc_data && "btc_data") ||
    (payload?.eth_data && "eth_data") ||
    undefined;

  if (key) {
    const sym = key === "sol_data" ? "SOL" : key === "btc_data" ? "BTC" : "ETH";
    const d = payload[key] ?? {};
    const decimals = Number(d?.base_price?.decimals ?? 0);
    const buyRaw = Number(d?.buy_price);
    const sellRaw = Number(d?.sell_price);
    if (!Number.isFinite(buyRaw) || !Number.isFinite(sellRaw)) return;

    const scale =
      decimals > 0
        ? Math.pow(10, decimals)
        : buyRaw > 100000 || sellRaw > 100000
        ? 10000
        : 1;

    return {
      sym,
      buy: buyRaw / scale,
      sell: sellRaw / scale,
      ts: Number(d?.timestamp ?? Date.now()),
    };
  }

  // Optional compatibility: { type:"market", symbol:"SOL", buy, sell, timestamp }
  if (msg?.type === "market" && msg?.symbol && msg?.buy && msg?.sell) {
    const sym = msg.symbol as AssetSymbol;
    return {
      sym,
      buy: Number(msg.buy),
      sell: Number(msg.sell),
      ts: Number(msg.timestamp ?? Date.now()),
    };
  }

  return;
}

export function useMarketData(url = "ws://localhost:8080/") {
  const [state, setState] = useState<StreamState>({
    SOL: undefined,
    BTC: undefined,
    ETH: undefined,
  } as StreamState);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let closed = false;
    let attempts = 0;

    const connect = () => {
      if (closed) return;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        attempts = 0;
      };

      ws.onmessage = async (ev) => {
        let text = "";
        if (typeof ev.data === "string") {
          text = ev.data;
        } else if (ev.data instanceof Blob) {
          text = await ev.data.text();
        } else if (ev.data instanceof ArrayBuffer) {
          text = new TextDecoder().decode(ev.data);
        }

        const parsed = safeParse(text);
        const u = normalize(parsed);
        if (u) {
          setState((prev) => ({
            ...prev,
            [u.sym]: { buy: u.buy, sell: u.sell, ts: u.ts },
          }));
        }
      };

      ws.onerror = () => {
        // Let onclose handle retry.
      };

      ws.onclose = () => {
        if (closed) return;
        const delay = Math.min(1000 * 2 ** attempts, 10000);
        attempts++;
        setTimeout(connect, delay);
      };
    };

    connect();
    return () => {
      closed = true;
      try {
        wsRef.current?.close();
      } catch {
        // ignore
      }
    };
  }, [url]);

  // Return last known prices (no flicker on partial updates)
  return useMemo(() => state, [state]);
}
