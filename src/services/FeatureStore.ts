import { DataPoint, timeSeriesService } from './TimeSeriesService';

export interface Indicators {
  rsi?: number;
  macd?: {
    value: number;
    signal: number;
    histogram: number;
  };
  bollingerBands?: {
    upper: number;
    middle: number;
    lower: number;
  };
}

/**
 * FeatureStore pre-calculates and caches technical indicators.
 */
export class FeatureStore {
  private cache: Map<string, Indicators> = new Map();

  constructor() {
    // Listen for new data points to update features
    // In a real system, this might be a background worker or a stream processor
  }

  /**
   * Calculate RSI (Relative Strength Index)
   */
  public calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length <= period) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const diff = prices[prices.length - i] - prices[prices.length - i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   */
  public calculateMACD(prices: number[]): Indicators['macd'] {
    // Simplified EMA calculation for demo purposes
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdValue = ema12 - ema26;
    const signal = this.calculateEMA([macdValue], 9); // Very simplified

    return {
      value: macdValue,
      signal: signal,
      histogram: macdValue - signal
    };
  }

  private calculateEMA(data: number[], period: number): number {
    if (data.length === 0) return 0;
    const k = 2 / (period + 1);
    let ema = data[0];
    for (let i = 1; i < data.length; i++) {
      ema = data[i] * k + ema * (1 - k);
    }
    return ema;
  }

  /**
   * Get features for a specific series
   */
  public async getFeatures(seriesId: string): Promise<Indicators> {
    const data = await timeSeriesService.query(seriesId);
    const prices = data.map(p => p.value);

    const features: Indicators = {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      bollingerBands: this.calculateBB(prices)
    };

    this.cache.set(seriesId, features);
    return features;
  }

  private calculateBB(prices: number[], period: number = 20): Indicators['bollingerBands'] {
    if (prices.length < period) return undefined;
    
    const slice = prices.slice(-period);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const stdDev = Math.sqrt(slice.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / period);

    return {
      upper: mean + stdDev * 2,
      middle: mean,
      lower: mean - stdDev * 2
    };
  }
}

export const featureStore = new FeatureStore();
