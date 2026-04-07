import React, { useState } from 'react';
import { Play, Settings2, BarChart3, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BacktestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  const runBacktest = () => {
    setIsRunning(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setResult({
            pnl: 15.4,
            trades: 42,
            sharpe: 2.1,
            drawdown: -4.2
          });
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="glass-card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <BarChart3 size={20} className="text-brand-secondary" />
          Backtest Engine
        </h3>
        <button 
          onClick={runBacktest}
          disabled={isRunning}
          className="flex items-center gap-2 bg-brand-secondary text-bg-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-secondary/80 transition-all disabled:opacity-50"
        >
          {isRunning ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />}
          {isRunning ? 'Running...' : 'Run Backtest'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Asset</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-200">
              <option>BTC/USDT</option>
              <option>ETH/USDT</option>
              <option>SOL/USDT</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Timeframe</label>
            <select className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-200">
              <option>1m</option>
              <option>5m</option>
              <option>15m</option>
              <option>1h</option>
            </select>
          </div>
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Processing historical data...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-lg bg-brand-primary/5 border border-brand-primary/20 space-y-3"
            >
              <div className="flex items-center gap-2 text-brand-primary text-sm font-bold">
                <CheckCircle2 size={16} />
                Backtest Complete
              </div>
              <div className="grid grid-cols-4 gap-2">
                <StatMini label="Net PnL" value={`+${result.pnl}%`} color="text-brand-primary" />
                <StatMini label="Trades" value={result.trades} />
                <StatMini label="Sharpe" value={result.sharpe} />
                <StatMini label="Drawdown" value={`${result.drawdown}%`} color="text-brand-danger" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function StatMini({ label, value, color = "text-gray-200" }: { label: string, value: any, color?: string }) {
  return (
    <div>
      <p className="text-[9px] text-gray-500 uppercase">{label}</p>
      <p className={`text-xs font-bold font-mono ${color}`}>{value}</p>
    </div>
  );
}
