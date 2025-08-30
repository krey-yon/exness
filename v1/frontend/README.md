Simple trading UI that connects to your backend services.

What it shows

- Header: project name and current user balance from http://localhost:8000/balance
- Left: live Buy/Sell prices from ws://localhost:8080/ (SOL, BTC, ETH)
- Center: candlestick chart via lightweight-charts loading from http://localhost:8000/{1min|5min|15min|30min|1hr}
- Right: order form (quantity, stopLoss, takeProfit, leverage slider). Submits to http://localhost:8000/order/{buy|sell}
- Bottom: orders table from http://localhost:8000/orders with Liquidate button (POST http://localhost:8000/liquidate)

Run locally

1. Ensure backend endpoints are available on ports 8000.
2. Start the dev server:

```bash
npm run dev
# or: bun dev
```

Navigate to http://localhost:8000.

Tech

- Next.js App Router, React 19
- Tailwind CSS v4
- lightweight-charts
