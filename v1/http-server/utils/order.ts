import type { Request, Response } from "express";
import { globalMarketState, users } from "./inMemoryDb";
import type { Position } from "../type";
import { randomUUIDv7 } from "bun";
import { updateBalance_long } from "../helpers/updateBalance";

export const newPositionLong = (req: Request, res: Response) => {
  //for more info/todo
  //   User enters a long →
  // They buy the asset (e.g., BTC) using their margin + leverage.
  // Example:

  // User has balance $1000

  // Quantity = 1 BTC, Current price = $200

  // Cost = $200 (but with leverage 2x, they only need $100 margin).

  // What happens to balance

  // You lock/deduct the margin (not necessarily the full cost if leverage is >1).

  // So in the example above, $100 is locked.

  // Profit / Loss (PnL)

  // If BTC goes from $200 → $210 (↑), user profits

  // If BTC goes $200 → $190 (↓), user loses

  const { quantity, assests, leverage, stopLoss, takeProfit } = req.body;
  const id = randomUUIDv7();
  const currentAssetPrice = globalMarketState.price;
  // const currentAssetValue = quantity * currentAssetPrice;
  const margin = currentAssetPrice / leverage;
  const position: Position = {
    id,
    quantity,
    assests,
    currentAssetPrice,
    leverage,
    margin,
    stopLoss,
    takeProfit,
  };
  const user = users.find((u) => u.id == 123);
  if (user) {
    user?.position?.Long.push(position);
    console.log("current sol price", globalMarketState.price);
    updateBalance_long(quantity, margin);
  }
  res.json(user);
};

export const userPortfolio = (req: Request, res: Response) => {
  const user = users.find((u) => u.id == 123);

  console.log({
    globalMarketState,
    user,
  });

  const userBalance = user?.balance;
  const userPositions = user?.position;
  const totalQuantity = userPositions?.Long.reduce(
    (sum, pos) => sum + pos.quantity,
    0
  );
  const globalPrice = globalMarketState.price;
  const assestsPrice = totalQuantity! * globalPrice;
  res.json({
    userBalance,
    assestsPrice,
  });
};

export const liquidateLong = (req: Request, res: Response) => {
  const { id } = req.body;

  const user = users.find((u) => u.id == 123);

  const globalPrice = globalMarketState.price;
  const userPositions = user?.position;

  if (userPositions) {
    const positionToliquidate = userPositions.Long.find((u) => u.id == id);
    const assestsQuantity = positionToliquidate?.quantity;
    const assestsPrice = assestsQuantity! * globalPrice;

    if (user) {
      user.balance = assestsPrice + user.balance;
      userPositions.Long = userPositions.Long.filter((p) => p.id !== id);
    }
  }
};

export const newPositionShort = (req: Request, res: Response) => {
  //for more info/todo
  //   BTC = $200
  // User opens short: Quantity = 1 BTC, leverage = 2

  // What happens behind the scenes:

  // Exchange "borrows" 1 BTC for the user and sells it immediately at $200

  // User now has $200 in cash (proceeds), but owes 1 BTC back

  // Balance impact:

  // You lock margin = (price * quantity) / leverage = $100

  // The $200 proceeds sit in the account, but cannot be withdrawn (because user must buy back BTC later).

  // Closing short:

  // If BTC drops to $190 → User buys back 1 BTC for $190, returns it, and keeps $10 profit.

  // If BTC rises to $210 → User must buy back for $210, loses $10.

  const { quantity, assests, leverage, stopLoss, takeProfit } = req.body;
  const id = randomUUIDv7();

  const user = users.find((u) => u.id == 123);
  const currentAssetPrice = globalMarketState.price;
  const margin = currentAssetPrice / leverage;
  const proceeds = currentAssetPrice * quantity;

  const position: Position = {
    id,
    quantity,
    assests,
    currentAssetPrice,
    leverage,
    margin,
    stopLoss,
    takeProfit,
    proceeds,
  };

  if (user) {
    user?.position?.Short.push(position);
    console.log("current sol price", globalMarketState.price);
    updateBalance_long(quantity, margin);
  }
  res.json(user);
};

export function liquidatePosition(req: Request, res: Response) {
  const { positionId, side } = req.body as {
    positionId: string;
    side: "Long" | "Short";
  };
  const user = users.find((u) => u.id == 123);
  if (!user) {
    return 0;
  }
  const exitPrice = globalMarketState.price;

  const positionList =
    side === "Long" ? user.position?.Long ?? [] : user.position?.Short ?? [];
  const position = positionList.find((o) => o.id == positionId);
  if (!position) {
    return 0;
  }

  let pnl = 0;
  if (side === "Long") {
    pnl = (exitPrice - position.currentAssetPrice) * position.quantity;
  } else {
    pnl = (position.currentAssetPrice - exitPrice) * position.quantity;
  }

  user.balance += position.margin + pnl;

  if (side === "Long") {
    user.position!.Long = (user.position?.Long ?? []).filter(
      (p) => p.id !== position.id
    );
  } else {
    user.position!.Short = (user.position?.Short ?? []).filter(
      (p) => p.id !== position.id
    );
  }

  res.json(pnl);
}

export const getAllOrders = (req: Request, res: Response) => {
  const user = users.find((u) => u.id == 123);
  const position = user?.position;
  res.json(position);
};
