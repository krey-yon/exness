"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type AssetSymbol = "SOL" | "BTC" | "ETH";

type MarketCtx = {
  asset: AssetSymbol;
  setAsset: (s: AssetSymbol) => void;
};

const Ctx = createContext<MarketCtx | null>(null);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [asset, setAsset] = useState<AssetSymbol>("SOL");
  const value = useMemo(() => ({ asset, setAsset }), [asset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMarket() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useMarket must be used within <MarketProvider>");
  return v;
}
