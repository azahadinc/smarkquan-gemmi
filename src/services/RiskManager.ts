import { EventEmitter } from 'events';
import { RiskConfig } from '../types';

export class RiskManager extends EventEmitter {
  private config: RiskConfig = {
    dailyDrawdownLimit: 5, // 5%
    maxPositionSize: 0.5, // Half-Kelly
    isCircuitBreakerActive: false
  };

  private startEquity: number = 100000;
  private currentEquity: number = 100000;

  constructor() {
    super();
  }

  public updateEquity(newEquity: number) {
    this.currentEquity = newEquity;
    this.checkCircuitBreaker();
  }

  private checkCircuitBreaker() {
    const drawdown = ((this.startEquity - this.currentEquity) / this.startEquity) * 100;

    if (drawdown >= this.config.dailyDrawdownLimit) {
      if (!this.config.isCircuitBreakerActive) {
        this.config.isCircuitBreakerActive = true;
        this.triggerCircuitBreaker(drawdown);
      }
    }
  }

  private triggerCircuitBreaker(drawdown: number) {
    console.error(`CRITICAL: Circuit Breaker Triggered! Daily Drawdown: ${drawdown.toFixed(2)}%`);
    this.emit('circuit-breaker:triggered', {
      drawdown,
      timestamp: Date.now()
    });
    
    // In a real system, this would call the OMS to flatten all positions
    this.flattenAllPositions();
  }

  private flattenAllPositions() {
    console.log('OMS: Flattening all active positions for safety...');
    // Simulated OMS call
  }

  public resetDaily() {
    this.startEquity = this.currentEquity;
    this.config.isCircuitBreakerActive = false;
    console.log('Risk Manager: Daily reset completed.');
  }

  public getConfig(): RiskConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<RiskConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

export const riskManager = new RiskManager();
