import { Client } from "pg";
import Redis from "ioredis";
import { handlewsdata } from "./utils/wsdatahandler";
import { handlePublishOrderBookData } from "./utils/orderbookpublish";
// import { Client } from "./node_modules/@types/pg";

const endpoint = "wss://fstream.binance.com/ws/btcusdt@depth5";

const socket = new WebSocket(endpoint);
const client = new Client(
  "postgresql://postgres:password@localhost:5432/postgres"
);
const redis = new Redis("redis://localhost:6379");

await client.connect();

let buffer: any[] = [];
let index = 0;

async function grabData(rawdata: any) {
  const data = handlewsdata(rawdata);
  buffer.push(data);
  const values = buffer
    .map(
      (t, i) =>
        ` (TO_TIMESTAMP($${i * 3 + 1} / 1000.0), $${i * 3 + 2}, $${i * 3 + 3})`
    )
    .join(",");
  const params = buffer.flatMap((t) => [
    t.timestamp,
    t.sellingPrice,
    t.buyingPrice,
  ]);
  console.log({
    "values": values,
    "params": params
  })
  await client.query(
    `INSERT INTO market_ticks (time, selling_price, buying_price) VALUES ${values}`,
    params
  );
  index++;
}

socket.addEventListener("message", (msg) => {
  try {
    // const data = handlewsdata(JSON.parse(msg.data));
    // console.log(data);
    setInterval(() => {
      grabData(JSON.parse(msg.data));
      console.log(`batch ${index} inserted`);
    }, 1000);
    buffer = [];

    const data = handlePublishOrderBookData(JSON.parse(msg.data));
    redis.publish("btcusdtorderbook", JSON.stringify(data));

  } catch (error) {
    console.log(error);
  }
});

// async function main() {
//   const schema = `CREATE TABLE IF NOT EXISTS market_ticks (
//     time TIMESTAMPTZ NOT NULL,
//     selling_price DOUBLE PRECISION,
//     buying_price DOUBLE PRECISION
//     );`;
//   const dbcalls = await client.query(schema);
//   console.log(dbcalls);
// }
// main()
