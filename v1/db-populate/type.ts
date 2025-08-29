export interface MarketEntry {
  timestamp: number;
  base_price: number;
}

// Define the structure for all markets we care about
export interface MarketData {
  ethusdt: MarketEntry;
  btcusdt: MarketEntry;
  solusdt: MarketEntry;
}