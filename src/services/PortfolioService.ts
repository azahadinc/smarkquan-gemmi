import { PortfolioAllocation } from '../types';

export class PortfolioService {
  /**
   * Kelly Criterion: f* = (bp - q) / b
   * b = odds received on the wager (decimal odds - 1)
   * p = probability of winning
   * q = probability of losing (1 - p)
   */
  public calculateKellyFraction(winProb: number, winLossRatio: number): number {
    const p = winProb;
    const q = 1 - p;
    const b = winLossRatio;

    if (b <= 0) return 0;
    
    const kelly = (b * p - q) / b;
    return Math.max(0, kelly); // Never return negative (no shorting in this simple model)
  }

  /**
   * Simplified Mean-Variance Optimization (MPT)
   * In a real system, this would solve a quadratic programming problem:
   * min w^T * Sigma * w subject to w^T * 1 = 1 and w^T * mu = target_return
   */
  public optimizePortfolio(assets: PortfolioAllocation[], riskTolerance: number = 0.5): PortfolioAllocation[] {
    // Simplified Inverse-Variance Weighting (a common heuristic for MPT)
    // Weight_i = (1 / Vol_i^2) / Sum(1 / Vol_j^2)
    
    const inverseVariances = assets.map(a => 1 / Math.pow(a.volatility, 2));
    const sumInverseVariances = inverseVariances.reduce((a, b) => a + b, 0);

    return assets.map((asset, i) => ({
      ...asset,
      weight: inverseVariances[i] / sumInverseVariances
    }));
  }

  /**
   * Calculate Portfolio Volatility
   * sigma_p = sqrt(w^T * Sigma * w)
   */
  public calculatePortfolioVolatility(assets: PortfolioAllocation[], correlations: number[][]): number {
    let variance = 0;
    for (let i = 0; i < assets.length; i++) {
      for (let j = 0; j < assets.length; j++) {
        const weightI = assets[i].weight;
        const weightJ = assets[j].weight;
        const volI = assets[i].volatility;
        const volJ = assets[j].volatility;
        const corrIJ = correlations[i][j];
        
        variance += weightI * weightJ * volI * volJ * corrIJ;
      }
    }
    return Math.sqrt(variance);
  }
}

export const portfolioService = new PortfolioService();
