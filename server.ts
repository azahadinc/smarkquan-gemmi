import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { WebSocketManager } from "./src/services/WebSocketManager.js";
import { featureStore } from "./src/services/FeatureStore.js";
import { timeSeriesService } from "./src/services/TimeSeriesService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const PORT = 3000;

  // Initialize WebSocket Manager
  const wsManager = new WebSocketManager(httpServer);

  // Simulated Market Data API (now using TimeSeriesService)
  app.get("/api/market-data", async (req, res) => {
    const symbol = (req.query.symbol as string) || "BTC-USD";
    const data = await timeSeriesService.query(symbol);
    res.json(data);
  });

  // Feature Store API
  app.get("/api/features/:symbol", async (req, res) => {
    const { symbol } = req.params;
    try {
      const features = await featureStore.getFeatures(symbol);
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate features" });
    }
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
