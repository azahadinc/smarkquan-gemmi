import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { timeSeriesService } from './TimeSeriesService';

/**
 * WebSocketManager handles live data ingestion and streaming.
 */
export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setup();
    this.startSimulation();
  }

  private setup() {
    this.wss.on('connection', (ws) => {
      console.log('Client connected to WebSocket');
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      // Initial state
      ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to Live Price Feed' }));
    });
  }

  /**
   * Broadcast data to all connected clients
   */
  public broadcast(data: any) {
    const payload = JSON.stringify(data);
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  /**
   * Simulate live price feeds from external exchanges (Binance/Coinbase)
   */
  private startSimulation() {
    setInterval(() => {
      const symbols = ['BTC-USD', 'ETH-USD', 'SOL-USD'];
      
      symbols.forEach(symbol => {
        const lastPrice = timeSeriesService.getLatest(symbol)?.value || 50000;
        const change = (Math.random() - 0.5) * 10;
        const newPrice = lastPrice + change;

        const point = {
          timestamp: Date.now(),
          value: newPrice,
          metadata: { symbol }
        };

        // Record in TimeSeries Database (Simulated)
        timeSeriesService.record(symbol, point);

        // Stream to clients
        this.broadcast({
          type: 'price_update',
          symbol,
          price: newPrice,
          timestamp: point.timestamp
        });
      });
    }, 1000);
  }
}
