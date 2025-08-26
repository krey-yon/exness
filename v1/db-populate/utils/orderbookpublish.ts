export const handlePublishOrderBookData = (msg: any) => {
  try {
    const Bid = msg.b;
    const Ask = msg.a;

    const response = {
        "bids": Bid,
        "ask": Ask,
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};