import React from 'react';
import { PerformanceStats as StatsType } from '../types';
import { formatPercent } from '../lib/utils';
import { TrendingUp, TrendingDown, Target, Activity, ShieldCheck } from 'lucide-react';

interface StatsProps {
  stats: StatsType;
}

export const PerformanceStats: React.FC<StatsProps> = ({ stats }) => {
  const items = [
    {
      label: 'Sharpe Ratio',
      value: stats.sharpeRatio.toFixed(2),
      icon: TrendingUp,
      color: 'text-brand-secondary',
    },
    {
      label: 'Max Drawdown',
      value: formatPercent(stats.maxDrawdown),
      icon: TrendingDown,
      color: 'text-brand-danger',
    },
    {
      label: 'Win Rate',
      value: formatPercent(stats.winRate),
      icon: Target,
      color: 'text-brand-primary',
    },
    {
      label: 'Profit Factor',
      value: stats.profitFactor.toFixed(2),
      icon: Activity,
      color: 'text-gray-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <div key={i} className="glass-card flex items-center gap-4">
          <div className={`p-2 rounded-lg bg-gray-800/50 ${item.color}`}>
            <item.icon size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
            <p className="text-xl font-bold font-mono">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
