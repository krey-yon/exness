export const sendOrderBookData = (wsArrary: any, data: any) => {
  wsArrary.forEach((ws: any) => {
    ws.send(JSON.stringify(data));
  });
};
