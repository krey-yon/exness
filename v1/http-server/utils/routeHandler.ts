import { decimalFormatedPrice } from "../helpers/resFromater";
import client from "./pgclient";
import type { Request, Response } from "express";

// const query = `
//     SELECT time_bucket($1, time) AS bucket,
//            MIN(selling_price) AS low,
//            MAX(selling_price) AS high,
//            FIRST(selling_price, time) AS open,
//            LAST(selling_price, time) AS close
//     FROM market_ticks
//     WHERE time > NOW() - INTERVAL '1 day'
//     GROUP BY bucket
//     ORDER BY bucket;
//   `;

// async function getAggregate(interval: string) {
//   const res = await client.query(query, [interval]);
//   return res.rows;
// }

export async function get1Min(req: Request, res: Response) {
  const query = `
  SELECT bucket, open, high, low, close
  FROM candles_1min
  WHERE bucket > NOW() - INTERVAL '1 day'
  ORDER BY bucket;
`;

  const data = await client.query(query);
  const response = decimalFormatedPrice(data.rows);
  res.json(response);
}

export async function get5Min(req: Request, res: Response) {
  const query = `
  SELECT bucket, open, high, low, close
  FROM candles_5min
  WHERE bucket > NOW() - INTERVAL '1 day'
  ORDER BY bucket;
`;

  const data = await client.query(query);
  const response = decimalFormatedPrice(data.rows);
  res.json(response);
}

export async function get15Min(req: Request, res: Response) {
  const query = `
  SELECT bucket, open, high, low, close
  FROM candles_15min
  WHERE bucket > NOW() - INTERVAL '1 day'
  ORDER BY bucket;
`;

  const data = await client.query(query);
  const response = decimalFormatedPrice(data.rows);
  res.json(response);
}

export async function get30Min(req: Request, res: Response) {
  const query = `
  SELECT bucket, open, high, low, close
  FROM candles_30min
  WHERE bucket > NOW() - INTERVAL '1 day'
  ORDER BY bucket;
`;

  const data = await client.query(query);
  const response = decimalFormatedPrice(data.rows);
  res.json(response);
}

export async function get1Hr(req: Request, res: Response) {
  const query = `
  SELECT bucket, open, high, low, close
  FROM candles_1hour
  WHERE bucket > NOW() - INTERVAL '1 day'
  ORDER BY bucket;
`;

  const data = await client.query(query);
  const response = decimalFormatedPrice(data.rows);
  res.json(response);
}
