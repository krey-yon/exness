export const handlewsdata = (msg: any) => {
  try {
    const current_price = msg.data.p;
    const current_timestamp = msg.data.E;

    const data = {
      price: parseFloat(current_price),
      timestamp: current_timestamp,
    };

    return data;
  } catch (error) {
    console.log(error);
  }
};