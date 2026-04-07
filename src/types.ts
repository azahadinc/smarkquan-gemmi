export interface MarketData {
  time: string;
  price: number;
  volume: number;
}

export interface PerformanceStats {
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  profitFactor: number;
}

export type MarketRegime = 'TRENDING_UP' | 'TRENDING_DOWN' | 'RANGING' | 'VOLATILE';

export interface Strategy {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Stopped';
  pnl: number;
  regime: MarketRegime;
  takeProfit?: number;
  stopLoss?: number;
  ma_period?: number;
}
