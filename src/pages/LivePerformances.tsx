import React from 'react';
import { PerformanceStats } from '../components/PerformanceStats';
import { MarketChart } from '../components/MarketChart';

export const LivePerformances: React.FC = () => {
  // Mock data for performance
  const stats = {
    sharpeRatio: 2.45,
    maxDrawdown: -12.4,
    winRate: 64.2,
    totalTrades: 1240,
    profitFactor: 1.85,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Live Performance Metrics</h2>
      <PerformanceStats stats={stats} />
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Portfolio Growth</h3>
        <div className="h-[400px]">
          {/* Add a more detailed performance chart here */}
          <p className="text-gray-400">Detailed performance chart would be rendered here.</p>
        </div>
      </div>
    </div>
  );
};
