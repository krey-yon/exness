export const handlewsdata = (msg: any) => {
  try {
    const bestBid = msg.b[0];
    const bestAsk = msg.a[0];

    const bestBidPrice = parseFloat(bestBid[0]);
    const bestAskPrice = parseFloat(bestAsk[0]);

    const data = {
      sellingPrice: bestAskPrice,
      buyingPrice: bestBidPrice,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.log(error);
  }
};