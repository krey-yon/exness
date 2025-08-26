import client from "./pgclient";
import type { Request, Response } from "express";

const query = `
    SELECT time_bucket($1, time) AS bucket,
           MIN(selling_price) AS low,
           MAX(selling_price) AS high,
           FIRST(selling_price, time) AS open,
           LAST(selling_price, time) AS close
    FROM market_ticks
    WHERE time > NOW() - INTERVAL '1 day'
    GROUP BY bucket
    ORDER BY bucket;
  `;

async function getAggregate(interval: string) {
  const res = await client.query(query, [interval]);
  return res.rows;
}

export async function get5Min(req: Request, res: Response) {
  const data = await getAggregate("5 minutes");
  res.json(data);
}

export async function get15Min(req: Request, res: Response) {
  const data = await getAggregate("15 minutes");
  res.json(data);
}

export async function get30Min(req: Request, res: Response) {
  const data = await getAggregate("30 minutes");
  res.json(data);
}

export async function get1Hr(req: Request, res: Response) {
  const data = await getAggregate("1 hour");
  res.json(data);
}

export async function get3Hr(req: Request, res: Response) {
  const data = await getAggregate("3 hours");
  res.json(data);
}
