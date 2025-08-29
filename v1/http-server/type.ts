// export type Position = {
//   id: string;
//   assests: string;
//   type: "Long" | "Short" | null;
//   quantity: number;
//   currentAssetPrice: number;
//   leverage: number;
//   stopLoss: number;
//   takeProfit: number;
// };

export type Position = {
  id: string;
  assests: string;
  quantity: number;
  currentAssetPrice: number;
  leverage: number;
  margin: number;
  stopLoss: number;
  takeProfit: number;
  proceeds?: number;
};

export type Order = {
  Short: Position[];
  Long: Position[];
}

export type User = {
  id: number;
  name: string;
  balance: number;
  position: Order | undefined;
};
