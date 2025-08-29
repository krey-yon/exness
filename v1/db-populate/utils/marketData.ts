import { resolve } from "bun";
import { toPreciseInt } from "../helper/precise";

export const handleHighSpreadData = (msg: any) => {
  // const base_price = parseFloat(msg.data.p);
  // console.log(msg[0].data)
  const base_price = toPreciseInt(msg[0].data.p);
  const timestamp = msg[0].data.T;
  const one_precent = base_price.int * 0.01;
  const buy_price = base_price.int + one_precent;
  const sell_price = base_price.int - one_precent;

  const response = {
    base_price,
    buy_price,
    sell_price,
    timestamp
  };

  return response;
};

export async function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}


export function filterByStream(trades: any, targetStream: any) {
  let tradesArray = [trades];
  const response = tradesArray.filter(
    (trade: any) => trade.stream == targetStream
  );
  if (response.length > 0) {
    const finaldata = handleHighSpreadData(response);
    tradesArray = [];
    return finaldata;
  }
}
