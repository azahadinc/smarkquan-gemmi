import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, BarChart3, Settings, Save, Play, Loader2, CheckCircle2, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StrategyDetail: React.FC = () => {
  const { id } = useParams();
  const [config, setConfig] = useState({
    takeProfit: 5,
    stopLoss: 2,
    ma_period: 20
  });
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runBacktest = () => {
    setIsRunning(true);
    setResult(null);
    const simulatedPnL = (config.takeProfit * 2) - (config.stopLoss * 0.5) + (config.ma_period / 10);
    setTimeout(() => {
      setIsRunning(false);
      setResult({
        pnl: simulatedPnL.toFixed(1),
        trades: Math.floor(Math.random() * 100) + 10,
        sharpe: (Math.random() * 2 + 1).toFixed(2),
        drawdown: (Math.random() * -10).toFixed(1)
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Link to="/strategies" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={18} /> Back
      </Link>
      
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center">
              <BrainCircuit size={32} className="text-brand-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-white">New Generated Strategy</h2>
                <button className="text-gray-500 hover:text-white"><Pencil size={18} /></button>
              </div>
              <p className="text-gray-400">APPL, Created 15 mins ago <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs">DRAFT</span></p>
            </div>
          </div>
          <button 
            onClick={runBacktest}
            disabled={isRunning}
            className="flex items-center gap-2 bg-brand-primary text-bg-dark px-6 py-3 rounded-lg font-bold hover:bg-brand-primary/90 transition-all disabled:opacity-50"
          >
            {isRunning ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
            {isRunning ? 'Running...' : 'Run Backtest'}
          </button>
        </div>

        <div className="grid grid-cols-6 gap-4">
          <Stat label="Capital" value="$ 15.000" />
          <Stat label="Net Profit" value="$ 12.000" />
          <Stat label="Annual Return" value="$ 50.37%" />
          <Stat label="Monthly Return" value="$ 3.45%" />
          <Stat label="Max Drawdown" value="12.07%" />
          <Stat label="Tradefy Score" value="4.5" />
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 className="text-brand-primary" /> Strategy Performance
        </h3>
        <div className="h-64 bg-gray-900/50 rounded-lg border border-gray-800 flex items-center justify-center text-gray-600">
          [Performance Chart Placeholder]
        </div>
      </div>
      
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-brand-primary/20 bg-brand-primary/5"
          >
            <h3 className="text-xl font-bold text-brand-primary mb-4 flex items-center gap-2">
              <CheckCircle2 /> Backtest Results
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <Stat label="Net PnL" value={`+${result.pnl}%`} color="text-brand-primary" />
              <Stat label="Trades" value={result.trades} />
              <Stat label="Sharpe" value={result.sharpe} />
              <Stat label="Drawdown" value={`${result.drawdown}%`} color="text-brand-danger" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function Stat({ label, value, color = "text-gray-200" }: { label: string, value: any, color?: string }) {
  return (
    <div className="bg-bg-dark p-4 rounded-lg border border-gray-800">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
    </div>
  );
}
