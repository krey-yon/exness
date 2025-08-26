import { WebSocketServer, type WebSocket, type RawData } from "ws";
import redis from "./utils/redisClient";

const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port: PORT });

await redis.connect();

wss.on("connection", (socket: WebSocket) => {
  console.log("Client connected");

  socket.on("message", (raw: RawData) => {
    const data = JSON.parse(raw.toString());
    switch (data.type) {
      case "orderbook": {
        console.log("orderbook request received");
        redis.subscribe("btcusdtorderbook", (data) => {
          socket.send(JSON.stringify({ type: "orderbook", data }));
        });
        break;
      }
      default: {
        console.warn("Unknown message:", data.type);
        break;
      }
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

wss.on("listening", () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});

wss.on("error", (err) => {
  console.error("WebSocket server error:", err);
});
