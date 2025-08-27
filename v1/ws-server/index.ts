import { WebSocketServer, WebSocket as WSWebSocket, type RawData } from "ws";
import redis from "./utils/redisClient";
import { sendOrderBookData } from "./utils/sendOrderbook";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

// await redis.subscribe("btcusdtorderbook");

const clients = new Set<WSWebSocket>();

wss.on("connection", (socket: WSWebSocket) => {
  console.log("Client connected");

  clients.add(socket);
  socket.on("message", (raw: RawData) => {
    const data = JSON.parse(raw.toString());
    switch (data.type) {
      case "orderbook": {
        console.log("Client requested orderbook updates")
        break;
      }
      default: {
        console.warn("Unknown message:", data.type);
        break;
      }
    }
  });

  socket.on("close", () => {
    clients.delete(socket);
    console.log("Client disconnected");
  });

  socket.on("error", (err) => {
    clients.delete(socket);
    console.error("Socket error:", err);
  });
});

wss.on("listening", () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});

wss.on("error", (err) => {
  console.error("WebSocket server error:", err);
});

redis.on("message", (channel, message) => {
  console.log(`Redis [${channel}]: ${message}`);
  for (const ws of clients) {
    if (ws.readyState == WSWebSocket.OPEN) {
      ws.send(JSON.stringify({ type: channel, data: JSON.parse(message) }));
    }
  }
});

(async () => {
  try {
    await redis.subscribe("btcusdtorderbook");
    console.log("Subscribed to Redis channel: btcusdtorderbook");
  } catch (err) {
    console.error("Redis subscribe error:", err);
  }
})();
