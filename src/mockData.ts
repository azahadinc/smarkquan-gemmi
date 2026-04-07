import { MarketData, PerformanceStats, Strategy } from './types';

export const mockMarketData: MarketData[] = Array.from({ length: 50 }, (_, i) => ({
  time: new Date(Date.now() - (50 - i) * 2000).toISOString(),
  price: 50000 + Math.random() * 1000 - 500,
  volume: Math.floor(Math.random() * 1000),
}));

export const mockStats: PerformanceStats = {
  sharpeRatio: 2.45,
  maxDrawdown: -12.4,
  winRate: 68.2,
  totalTrades: 1240,
  profitFactor: 1.85,
};

export const mockStrategies: Strategy[] = [
  { id: 'S-001', name: 'BTC Trend Follower', status: 'Active', pnl: 12450.50, regime: 'TRENDING_UP', takeProfit: 5, stopLoss: 2, ma_period: 20 },
  { id: 'S-002', name: 'ETH Mean Reversion', status: 'Active', pnl: -2340.20, regime: 'RANGING', takeProfit: 3, stopLoss: 1.5, ma_period: 50 },
  { id: 'S-003', name: 'SOL Volatility Scalper', status: 'Paused', pnl: 5600.00, regime: 'VOLATILE', takeProfit: 2, stopLoss: 1, ma_period: 10 },
  { id: 'S-004', name: 'ADA Breakout', status: 'Stopped', pnl: -500.00, regime: 'TRENDING_DOWN', takeProfit: 4, stopLoss: 2, ma_period: 30 },
];
