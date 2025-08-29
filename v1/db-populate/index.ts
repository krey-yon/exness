import Redis from "ioredis";
import { handlewsdata } from "./utils/wsdatahandler";
import { handlePublishOrderBookData } from "./utils/orderbookpublish";
import { filterByStream } from "./utils/marketData";

// const endpoint = "wss://fstream.binance.com/ws/btcusdt@depth5";
// const endpoint = "wss://stream.binance.com:9443/stream?streams=btcusdt@trade";
const endpoint =
  "wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade";

const socket = new WebSocket(endpoint);
const redis = new Redis("redis://localhost:6379");

let buffer: any[] = [];
const BATCH_SIZE = 500;

function grabData(rawdata: any) {
  // const data = handlewsdata(rawdata);
  // console.log(rawdata);
  buffer.push(rawdata);

  if (buffer.length >= BATCH_SIZE) {
    flushBuffer().catch(console.error);
  }
}

async function flushBuffer() {
  if (buffer.length === 0) return;
  //changes
  // const values = buffer
  //   .map(
  //     (t, i) =>
  //       ` (TO_TIMESTAMP($${i * 3 + 1} / 1000.0), $${i * 3 + 2}, $${i * 3 + 3})`
  //   )
  //   .join(",");

  //change too
  // const values = buffer
  //   .map((_, i) => ` (TO_TIMESTAMP($${i * 2 + 1} / 1000.0), $${i * 2 + 2})`)
  //   .join(",");

  // const params = buffer.flatMap((t) => [t.timestamp, t.price]);
  // console.log({
  //   values: values,
  //   params: params,
  // });
  // await client.query(
  //   `INSERT INTO market_ticks (time, price) VALUES ${values}`,
  //   params
  // );
  // buffer = [];
  // index++;

  //change 3rd
  if (buffer.length === 0) return;

  const batch = buffer;
  buffer = []; // reset

  // Push batch into Redis queue
  await redis.lpush("batchQueue", JSON.stringify(batch));
  console.log(`Enqueued batch of size ${batch.length}`);
}

setInterval(() => {
  flushBuffer().catch(console.error);
}, 2000);

socket.addEventListener("message", (msg) => {
  try {
    // grabData(JSON.parse(msg.data));
    // console.log(JSON.parse(msg.data));
    // const data = handleHighSpreadData(JSON.parse(msg.data));
    // redis.publish("currentbtcusdtprice", JSON.stringify(data));
    const parsedData = JSON.parse(msg.data);
    const sol_data = filterByStream(parsedData, "solusdt@trade");
    const btc_data = filterByStream(parsedData, "btcusdt@trade");
    const eth_data = filterByStream(parsedData, "ethusdt@trade");
    // if (sol_data && btc_data && eth_data) {
      const response = {
        sol_data,
        btc_data,
        eth_data,
      };
      // console.log(response)

      if(sol_data){
        grabData(sol_data)
      }

      redis.publish("marketdata", JSON.stringify(response))
    // }
  } catch (error) {
    console.log(error);
  }
});

// async function main() {
//   const schema = `CREATE TABLE market_ticks (
//     time TIMESTAMPTZ NOT NULL,
//     price DOUBLE PRECISION
//     );`;
//   const dbcalls = await client.query(schema);
//   console.log(dbcalls);
// }
// main()
