import { globalMarketState, users } from "../utils/inMemoryDb";

export const updateBalance_long = (quantity: number, margin: number) => {
  const user = users.find((u) => u.id == 123);

  if (user) {
    user.balance -= margin;
  }
};

// export function liquidatePosition(positionId: string, side: "Long" | "Short") {
//   const user = users.find((u) => u.id == 123);
//   if (!user) {
//     return 0;
//   }
//   const exitPrice = globalMarketState.price;

//   const positionList = user.position?.[side] ?? [];
//   const position = positionList.find((o) => o.id == positionId);
//   if (!position) {
//     return 0;
//   }

//   let pnl = 0;
//   if (side === "Long") {
//     pnl = (exitPrice - position.currentAssetPrice) * position.quantity;
//   } else {
//     pnl = (position.currentAssetPrice - exitPrice) * position.quantity;
//   }

//   user.balance += position.margin + pnl;

//   user.position![side] = positionList.filter((p) => p.id !== position.id);

//   return pnl;
// }
