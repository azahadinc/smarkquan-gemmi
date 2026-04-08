import { ExecutionConfig, MarketData } from '../types';

export class BacktestService {
  /**
   * Calculate execution price considering slippage and market impact.
   * This simulates real-world friction where large orders move the market.
   * 
   * @param requestedPrice The current market price when the order was sent
   * @param quantity The amount being traded
   * @param side BUY or SELL
   * @param config Execution configuration (model type and values)
   * @param marketVolatility Optional: Current market volatility (used for impact models)
   */
  public calculateExecutionPrice(
    requestedPrice: number,
    quantity: number,
    side: 'BUY' | 'SELL',
    config: ExecutionConfig,
    marketVolatility: number = 0.02
  ): number {
    if (quantity <= 0) return requestedPrice;

    let slippage = 0;

    switch (config.slippageModel) {
      case 'FIXED':
        // Fixed slippage amount per unit (e.g., $0.01 per share)
        slippage = config.slippageValue;
        break;

      case 'PERCENTAGE':
        // Percentage-based slippage (e.g., 0.1% of the price)
        slippage = requestedPrice * (config.slippageValue / 100);
        break;

      case 'MARKET_IMPACT':
        /**
         * Market Impact Model (Square Root Law)
         * impact = Y * sigma * sqrt(v / V)
         * 
         * In this implementation:
         * - Y * (1/sqrt(V)) is represented by config.slippageValue (the "Impact Coefficient")
         * - sigma is marketVolatility
         * - v is quantity
         */
        const impactCoefficient = config.slippageValue || 0.0001;
        slippage = requestedPrice * (impactCoefficient * marketVolatility * Math.sqrt(quantity));
        break;

      default:
        slippage = 0;
    }

    // Slippage always makes the price worse for the trader:
    // Higher price when buying, lower price when selling.
    return side === 'BUY' ? requestedPrice + slippage : requestedPrice - slippage;
  }

  /**
   * Simulate execution latency
   */
  public async simulateLatency(config: ExecutionConfig): Promise<void> {
    if (config.latencyMs > 0) {
      await new Promise(resolve => setTimeout(resolve, config.latencyMs));
    }
  }

  /**
   * Run a backtest with realistic friction
   */
  public runBacktest(data: MarketData[], config: ExecutionConfig) {
    let balance = 100000;
    const trades = [];

    // Backtest logic would go here, applying calculateExecutionPrice to every trade
    // and considering latency for order fills
    
    return {
      finalBalance: balance,
      trades: trades,
      config: config
    };
  }
}

export const backtestService = new BacktestService();
