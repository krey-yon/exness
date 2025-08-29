import express, { type Request, type Response } from "express";
import client from "./utils/pgclient";
import {
  get15Min,
  get1Hr,
  get1Min,
  get30Min,
  get5Min,
} from "./utils/routeHandler";
import cors from "cors";
import { createUser, signUser } from "./utils/user";
import { getAllOrders, liquidatePosition, newPositionLong, newPositionShort, userPortfolio } from "./utils/order";
import redis from "./utils/redisClient";
import { globalMarketState } from "./utils/inMemoryDb";
import { getSolPrice } from "./helpers/getSolData";
import { fromPreciseInt } from "./helpers/resFromater";

await client.connect();
await redis.subscribe("marketdata");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const port = 3000;

redis.on("message", (channel, message) => {
  // console.log(`Redis [${channel}]: ${message}`);
  const data = JSON.parse(message);
  const solPrice = getSolPrice(data);
  if (solPrice) {
    globalMarketState.price = fromPreciseInt(solPrice);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/1min", get1Min);
app.get("/5min", get5Min);
app.get("/15min", get15Min);
app.get("/30hr", get30Min);
app.get("/1hr", get1Hr);

app.post("/signup", createUser);
app.post("/signin", signUser);

app.post("/order/buy", newPositionLong);
app.post("/order/sell", newPositionShort);
app.get("/balance", userPortfolio);

app.post("/liquidate", liquidatePosition);
app.get("/orders",getAllOrders)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
