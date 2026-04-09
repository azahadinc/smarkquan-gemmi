import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, BarChart3, Settings, Save, Play, Loader2, CheckCircle2, Pencil, Zap, Sparkles, TrendingUp, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StrategyDetail: React.FC = () => {
  const { id } = useParams();
  const [config, setConfig] = useState({
    takeProfit: 5,
    stopLoss: 2,
    ma_period: 20
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showMonteCarlo, setShowMonteCarlo] = useState(false);

  const runBacktest = () => {
    setIsRunning(true);
    setResult(null);
    const simulatedPnL = (config.takeProfit * 2) - (config.stopLoss * 0.5) + (config.ma_period / 10);
    setTimeout(() => {
      setIsRunning(false);
      setResult({
        pnl: simulatedPnL.toFixed(1),
        totalTrades: Math.floor(Math.random() * 100) + 10,
        winRate: (Math.random() * 30 + 50).toFixed(1),
        profitFactor: (Math.random() * 1.2 + 1.3).toFixed(2),
        sharpe: (Math.random() * 2 + 1).toFixed(2),
        drawdown: (Math.random() * -10).toFixed(1)
      });
    }, 2000);
  };

  const goLive = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsLive(true);
    }, 1500);
  };

  const runOptimization = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setConfig({
        takeProfit: 7.5,
        stopLoss: 1.8,
        ma_period: 24
      });
      // Trigger a re-backtest with new params
      runBacktest();
    }, 3000);
  };

  const monteCarloPaths = useMemo(() => {
    if (!result) return [];
    return [...Array(10)].map(() => {
      let balance = 100;
      return [...Array(20)].map(() => {
        balance += (Math.random() - 0.45) * 5;
        return balance;
      });
    });
  }, [result]);

  return (
    <div className="space-y-6 pb-20">
      <Link to="/strategies" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={18} /> Back
      </Link>
      
      <div className="glass-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center border border-white/5">
              <BrainCircuit size={32} className="text-brand-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-white tracking-tight">Institutional Trend Follower</h2>
                <button className="text-gray-500 hover:text-white transition-colors"><Pencil size={18} /></button>
              </div>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                BTC-USD, Created 15 mins ago 
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isLive ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-gray-800 text-gray-400'}`}>
                  {isLive ? 'Live' : 'Draft'}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={runOptimization}
              disabled={isOptimizing || isLive}
              className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-6 py-3 rounded-xl font-bold hover:bg-purple-500/20 transition-all disabled:opacity-50"
            >
              {isOptimizing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {isOptimizing ? 'AI Optimizing...' : 'AI Optimize'}
            </button>
            <button 
              onClick={runBacktest}
              disabled={isRunning || isLive}
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50"
            >
              {isRunning ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} />}
              {isRunning ? 'Running...' : 'Run Backtest'}
            </button>
            <button 
              onClick={goLive}
              disabled={isLive || isConnecting}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 ${
                isLive 
                  ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                  : 'bg-brand-primary text-bg-dark hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/20'
              }`}
            >
              {isConnecting ? <Loader2 className="animate-spin" size={20} /> : isLive ? <CheckCircle2 size={20} /> : <Zap size={20} />}
              {isConnecting ? 'Connecting OMS...' : isLive ? 'Strategy Live' : 'Go Live'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Stat label="Capital" value="$ 15.000" />
          <Stat label="Net Profit" value="$ 12.000" />
          <Stat label="Annual Return" value="50.37%" />
          <Stat label="Monthly Return" value="3.45%" />
          <Stat label="Max Drawdown" value="12.07%" />
          <Stat label="Tradefy Score" value="4.5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters Section */}
        <div className="lg:col-span-1 glass-card p-6 space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="text-brand-primary" size={20} /> Hyperparameters
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Take Profit (%)</label>
              <input 
                type="number" 
                value={config.takeProfit}
                onChange={(e) => setConfig({...config, takeProfit: Number(e.target.value)})}
                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white font-mono focus:border-brand-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">Stop Loss (%)</label>
              <input 
                type="number" 
                value={config.stopLoss}
                onChange={(e) => setConfig({...config, stopLoss: Number(e.target.value)})}
                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white font-mono focus:border-brand-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 uppercase font-bold tracking-widest">EMA Period</label>
              <input 
                type="number" 
                value={config.ma_period}
                onChange={(e) => setConfig({...config, ma_period: Number(e.target.value)})}
                className="w-full bg-black/40 border border-gray-800 rounded-xl p-3 text-white font-mono focus:border-brand-primary outline-none transition-all"
              />
            </div>
          </div>
          <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
            <p className="text-[10px] text-purple-400 leading-relaxed">
              <span className="font-bold uppercase mr-1">AI Insight:</span> 
              Our Optuna-based optimizer suggests increasing EMA Period to 24 for better noise filtering in current market regimes.
            </p>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="lg:col-span-2 glass-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-brand-primary" size={20} /> Equity Curve
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowMonteCarlo(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${!showMonteCarlo ? 'bg-brand-primary text-bg-dark' : 'text-gray-500 hover:text-white'}`}
              >
                Standard
              </button>
              <button 
                onClick={() => setShowMonteCarlo(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${showMonteCarlo ? 'bg-purple-500 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Monte Carlo
              </button>
            </div>
          </div>
          <div className="h-64 bg-black/40 rounded-xl border border-gray-800 flex items-center justify-center relative overflow-hidden">
            {!showMonteCarlo ? (
              <div className="text-gray-600 font-mono text-sm">[ Performance Chart Visualization ]</div>
            ) : (
              <div className="w-full h-full p-4 flex items-end gap-1">
                {monteCarloPaths.map((path, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-0.5 opacity-30 hover:opacity-100 transition-opacity">
                    {path.map((val, j) => (
                      <div 
                        key={j} 
                        className="w-full bg-purple-500/50 rounded-full" 
                        style={{ height: `${val / 2}px` }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
            {showMonteCarlo && (
              <div className="absolute top-4 right-4 bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl backdrop-blur-md">
                <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest mb-1">Stress Test</p>
                <p className="text-white font-bold text-xs">95% Confidence Interval</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 border-brand-primary/20 bg-brand-primary/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-brand-primary flex items-center gap-2">
                <CheckCircle2 /> Backtest Results
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <TrendingUp size={14} />
                <span>Simulated on 2 years of historical data</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Stat label="Net PnL" value={`+${result.pnl}%`} color="text-brand-primary" />
              <Stat label="Total Trades" value={result.totalTrades} />
              <Stat label="Win Rate" value={`${result.winRate}%`} />
              <Stat label="Profit Factor" value={result.profitFactor} />
              <Stat label="Sharpe" value={result.sharpe} />
              <Stat label="Drawdown" value={`${result.drawdown}%`} color="text-red-400" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Risk Management Section */}
      <div className="glass-card p-6 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="text-red-400" size={20} /> Risk Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-black/20 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Position Sizing</p>
            <p className="text-white font-bold">5% of Capital</p>
            <p className="text-[10px] text-gray-500 mt-1">Fixed percentage per trade</p>
          </div>
          <div className="p-4 bg-black/20 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Max Open Trades</p>
            <p className="text-white font-bold">3 Positions</p>
            <p className="text-[10px] text-gray-500 mt-1">Global portfolio limit</p>
          </div>
          <div className="p-4 bg-black/20 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Circuit Breaker</p>
            <p className="text-red-400 font-bold">-10% Daily</p>
            <p className="text-[10px] text-gray-500 mt-1">Automatic halt on drawdown</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function Stat({ label, value, color = "text-gray-200" }: { label: string, value: any, color?: string }) {
  return (
    <div className="bg-black/40 p-4 rounded-xl border border-gray-800 hover:border-white/10 transition-colors group">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 group-hover:text-gray-400 transition-colors">{label}</p>
      <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
    </div>
  );
}
