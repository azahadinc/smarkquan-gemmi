import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Simulated Market Data API
  app.get("/api/market-data", (req, res) => {
    const data = Array.from({ length: 50 }, (_, i) => ({
      time: new Date(Date.now() - (50 - i) * 60000).toISOString(),
      price: 50000 + Math.random() * 1000 - 500,
      volume: Math.floor(Math.random() * 100),
    }));
    res.json(data);
  });

  // Simulated Strategy Performance
  app.get("/api/performance", (req, res) => {
    res.json({
      sharpeRatio: 2.45,
      maxDrawdown: -12.4,
      winRate: 64.2,
      totalTrades: 1240,
      profitFactor: 1.85,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
