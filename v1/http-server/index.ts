import express, { type Request, type Response } from "express";
import client from "./utils/pgclient";
import {
  get15Min,
  get1Hr,
  get30Min,
  get3Hr,
  get5Min,
} from "./utils/routeHandler";
import cors from "cors";

await client.connect();

const app = express();
app.use(cors({ origin: "*" }));
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/5min", get5Min);
app.get("/15min", get15Min);
app.get("/30min", get30Min);
app.get("/1hr", get1Hr);
app.get("/3hr", get3Hr);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
