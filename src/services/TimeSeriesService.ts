import { EventEmitter } from 'events';

export interface DataPoint {
  timestamp: number;
  value: number;
  metadata?: Record<string, any>;
}

/**
 * TimeSeriesService handles efficient storage and retrieval of timestamped data.
 * In a production environment, this would interface with TimescaleDB or InfluxDB.
 */
export class TimeSeriesService extends EventEmitter {
  private data: Map<string, DataPoint[]> = new Map();
  private maxRetention: number = 1000; // Max points per series in memory

  constructor() {
    super();
  }

  /**
   * Record a new data point for a specific series (e.g., 'BTC-USD')
   */
  public async record(seriesId: string, point: DataPoint): Promise<void> {
    if (!this.data.has(seriesId)) {
      this.data.set(seriesId, []);
    }

    const series = this.data.get(seriesId)!;
    series.push(point);

    // Maintain retention policy
    if (series.length > this.maxRetention) {
      series.shift();
    }

    this.emit(`update:${seriesId}`, point);
  }

  /**
   * Retrieve historical data for a series
   */
  public async query(seriesId: string, from?: number, to?: number): Promise<DataPoint[]> {
    const series = this.data.get(seriesId) || [];
    
    if (!from && !to) return series;

    return series.filter(p => {
      const isAfter = from ? p.timestamp >= from : true;
      const isBefore = to ? p.timestamp <= to : true;
      return isAfter && isBefore;
    });
  }

  /**
   * Get the latest point for a series
   */
  public getLatest(seriesId: string): DataPoint | null {
    const series = this.data.get(seriesId);
    return series && series.length > 0 ? series[series.length - 1] : null;
  }
}

export const timeSeriesService = new TimeSeriesService();
