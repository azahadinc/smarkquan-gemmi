export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TRAILING_STOP' | 'OCO';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED' | 'REJECTED';

export interface Order {
  id: string;
  symbol: string;
  type: OrderType;
  side: OrderSide;
  quantity: number;
  price?: number; // For LIMIT orders
  stopPrice?: number; // For STOP_LOSS orders
  trailingDelta?: number; // For TRAILING_STOP orders
  linkedOrderId?: string; // For OCO orders
  status: OrderStatus;
  timestamp: number;
}

export interface ExecutionConfig {
  slippageModel: 'FIXED' | 'PERCENTAGE' | 'MARKET_IMPACT';
  slippageValue: number;
  latencyMs: number;
}

export interface PortfolioAllocation {
  symbol: string;
  weight: number; // Percentage of capital (0-1)
  expectedReturn: number;
  volatility: number;
}

export interface RiskConfig {
  dailyDrawdownLimit: number; // Percentage (e.g., 5 for 5%)
  maxPositionSize: number; // Max Kelly fraction (e.g., 0.5 for half-Kelly)
  isCircuitBreakerActive: boolean;
}

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
