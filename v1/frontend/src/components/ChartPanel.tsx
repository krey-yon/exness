"use client";

import {
  createChart,
  CandlestickSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { useMarket } from "./MarketContext";

type TF = "1min" | "5min" | "15min" | "30min" | "1hr";

type Candle = {
  bucket: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export function ChartPanel() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [tf, setTf] = useState<TF>("1min");
  const { asset } = useMarket();

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: { background: { color: "#0a0a0a" }, textColor: "#ddd" },
      grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } },
      autoSize: true,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chartRef.current?.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`http://localhost:8000/${tf}`, {
          cache: "no-store",
        });
        if (!res.ok) return;

        const raw: Candle[] = await res.json();

        if (cancelled || !seriesRef.current) return;

        const bars: CandlestickData<UTCTimestamp>[] = raw.map((c) => ({
          time: Math.floor(new Date(c.bucket).getTime() / 1000) as UTCTimestamp,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));

        seriesRef.current.setData(bars);
        chartRef.current?.timeScale().fitContent();
      } catch {
        // ignore network errors in UI
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tf, asset]);

  return (
    <div className="flex h-[520px] flex-col gap-3">
      <div className="flex items-center gap-2">
        {(["1min", "5min", "15min", "30min", "1hr"] as TF[]).map((k) => (
          <button
            key={k}
            onClick={() => setTf(k)}
            className={`rounded-md border px-2 py-1 text-xs ${
              tf === k
                ? "border-white/40 bg-white/10"
                : "border-white/10 bg-neutral-800/40"
            }`}
          >
            {k}
          </button>
        ))}
        <div className="ml-auto text-sm text-neutral-300">{asset}/USDT</div>
      </div>
      <div
        ref={containerRef}
        className="min-h-0 grow rounded-md border border-white/10"
      />
    </div>
  );
}
