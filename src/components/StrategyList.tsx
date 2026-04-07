import React from 'react';
import { Strategy } from '../types';
import { Play, Pause, Square, BrainCircuit } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

interface StrategyListProps {
  strategies: Strategy[];
}

export const StrategyList: React.FC<StrategyListProps> = ({ strategies }) => {
  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-200">Active Strategies</h3>
        <button className="text-xs bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors">
          + New Strategy
        </button>
      </div>
      <div className="space-y-4">
        {strategies.map((strat) => (
          <div
            key={strat.id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-800 hover:border-gray-700 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-md bg-gray-800 group-hover:bg-gray-700 transition-colors">
                <BrainCircuit size={18} className="text-brand-secondary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-200">{strat.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold",
                    strat.regime === 'TRENDING_UP' ? "bg-green-500/10 text-green-500" :
                    strat.regime === 'TRENDING_DOWN' ? "bg-red-500/10 text-red-500" :
                    "bg-blue-500/10 text-blue-500"
                  )}>
                    {strat.regime.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">ID: {strat.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className={cn(
                  "text-sm font-bold font-mono",
                  strat.pnl >= 0 ? "text-brand-primary" : "text-brand-danger"
                )}>
                  {strat.pnl >= 0 ? '+' : ''}{formatCurrency(strat.pnl)}
                </p>
                <p className="text-[10px] text-gray-500 uppercase">Total PnL</p>
              </div>
              <div className="flex items-center gap-2">
                {strat.status === 'active' ? (
                  <button className="p-1.5 hover:bg-gray-700 rounded transition-colors text-gray-400">
                    <Pause size={16} />
                  </button>
                ) : (
                  <button className="p-1.5 hover:bg-gray-700 rounded transition-colors text-brand-primary">
                    <Play size={16} />
                  </button>
                )}
                <button className="p-1.5 hover:bg-gray-700 rounded transition-colors text-gray-400">
                  <Square size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
