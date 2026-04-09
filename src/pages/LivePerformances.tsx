import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Play, 
  Square, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  LayoutGrid, 
  List, 
  History, 
  Terminal as TerminalIcon,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PerformanceStats } from '../components/PerformanceStats';
import { MarketChart } from '../components/MarketChart';
import { Order, OrderType, OrderSide, Strategy } from '../types';

export const LivePerformances: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'terminal' | 'strategies'>('monitor');
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [livePositions, setLivePositions] = useState<any[]>([
    { id: 'P-1', symbol: 'BTC-USD', side: 'BUY', qty: 0.5, entry: 64200, current: 65120, pnl: 460, pnlPercent: 1.43 },
    { id: 'P-2', symbol: 'ETH-USD', side: 'SELL', qty: 10, entry: 3450, current: 3380, pnl: 700, pnlPercent: 2.03 },
  ]);
  const [activeStrategies, setActiveStrategies] = useState<Strategy[]>([
    { id: 'S-001', name: 'Institutional Trend Follower', status: 'Active', pnl: 1240, regime: 'TRENDING_UP' },
    { id: 'S-002', name: 'Mean Reversion ETH', status: 'Paused', pnl: -450, regime: 'RANGING' },
  ]);
  const [logs, setLogs] = useState<any[]>([
    { id: 1, time: '12:45:02', msg: 'Strategy [S-001] executed BUY 0.2 BTC @ 64,500', type: 'execution' },
    { id: 2, time: '12:44:58', msg: 'OMS Connection established with Binance', type: 'system' },
    { id: 3, time: '12:44:10', msg: 'Risk Check Passed: Margin utilization 12%', type: 'risk' },
  ]);

  const stats = {
    sharpeRatio: 2.45,
    maxDrawdown: -12.4,
    winRate: 64.2,
    totalTrades: 1240,
    profitFactor: 1.85,
  };

  const totalUnrealizedPnL = useMemo(() => {
    return livePositions.reduce((acc, pos) => acc + pos.pnl, 0);
  }, [livePositions]);

  const toggleStrategy = (id: string) => {
    setActiveStrategies(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' };
      }
      return s;
    }));
    
    const strat = activeStrategies.find(s => s.id === id);
    const action = strat?.status === 'Active' ? 'Paused' : 'Started';
    setLogs(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      msg: `Strategy [${strat?.name}] ${action} manually.`,
      type: 'system'
    }, ...prev]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header HUD */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <div className="flex-1 glass-card p-6 flex items-center justify-between bg-gradient-to-br from-brand-primary/5 to-transparent border-brand-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center border border-brand-primary/30 shadow-lg shadow-brand-primary/10">
              <Globe className="text-brand-primary animate-pulse" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Live Command Center</h2>
              <p className="text-xs text-brand-primary font-bold flex items-center gap-1 uppercase tracking-widest">
                <span className="w-2 h-2 bg-brand-primary rounded-full animate-ping" />
                OMS Connected: Binance Live
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total Unrealized PnL</p>
            <p className={`text-2xl font-bold font-mono ${totalUnrealizedPnL >= 0 ? 'text-brand-primary' : 'text-red-400'}`}>
              {totalUnrealizedPnL >= 0 ? '+' : ''}${totalUnrealizedPnL.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="lg:w-1/3 grid grid-cols-2 gap-4">
          <div className="glass-card p-4 flex flex-col justify-center">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Active Strategies</p>
            <p className="text-2xl font-bold text-white font-mono">{activeStrategies.filter(s => s.status === 'Active').length}</p>
          </div>
          <div className="glass-card p-4 flex flex-col justify-center">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Margin Used</p>
            <p className="text-2xl font-bold text-white font-mono">12.4%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Navigation & Tools */}
        <div className="lg:col-span-8 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 bg-gray-900 rounded-xl border border-gray-800 w-fit">
            <TabButton active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} icon={LayoutGrid} label="Live Monitor" />
            <TabButton active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} icon={TerminalIcon} label="Terminal" />
            <TabButton active={activeTab === 'strategies'} onClick={() => setActiveTab('strategies')} icon={Zap} label="Strategies" />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'monitor' && (
              <motion.div 
                key="monitor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Live Positions */}
                <div className="glass-card p-0 overflow-hidden">
                  <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <List size={16} className="text-brand-primary" /> Active Positions
                    </h3>
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Real-time update</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-gray-800">
                          <th className="p-4 font-bold">Symbol</th>
                          <th className="p-4 font-bold">Side</th>
                          <th className="p-4 font-bold">Size</th>
                          <th className="p-4 font-bold">Entry</th>
                          <th className="p-4 font-bold">Current</th>
                          <th className="p-4 font-bold text-right">PnL</th>
                          <th className="p-4 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800/50">
                        {livePositions.map(pos => (
                          <tr key={pos.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4 font-bold text-white">{pos.symbol}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pos.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {pos.side}
                              </span>
                            </td>
                            <td className="p-4 font-mono text-gray-300">{pos.qty}</td>
                            <td className="p-4 font-mono text-gray-400">${pos.entry.toLocaleString()}</td>
                            <td className="p-4 font-mono text-gray-400">${pos.current.toLocaleString()}</td>
                            <td className={`p-4 text-right font-bold font-mono ${pos.pnl >= 0 ? 'text-brand-primary' : 'text-red-400'}`}>
                              <div className="flex flex-col items-end">
                                <span>{pos.pnl >= 0 ? '+' : ''}${pos.pnl}</span>
                                <span className="text-[10px] opacity-70">{pos.pnlPercent}%</span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <button className="text-gray-500 hover:text-red-400 transition-colors">
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Market Chart */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp size={16} className="text-brand-primary" /> BTC-USD Live Feed
                    </h3>
                    <div className="flex gap-2">
                      {['1m', '5m', '15m', '1h'].map(tf => (
                        <button key={tf} className="px-2 py-1 rounded text-[10px] font-bold bg-gray-800 text-gray-400 hover:text-white transition-colors">{tf}</button>
                      ))}
                    </div>
                  </div>
                  <div className="h-64 bg-black/40 rounded-xl border border-gray-800 flex items-center justify-center text-gray-600 font-mono text-xs">
                    [ Real-time TradingView Widget Placeholder ]
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'terminal' && (
              <motion.div 
                key="terminal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-8"
              >
                <div className="max-w-md mx-auto space-y-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Execution Terminal</h3>
                    <p className="text-gray-400 text-sm">Direct market access via Tradefy OMS</p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <button className="bg-green-500/10 border-2 border-green-500/50 text-green-500 p-4 rounded-2xl font-bold flex flex-col items-center gap-2 hover:bg-green-500/20 transition-all">
                        <ArrowUpRight size={24} />
                        BUY / LONG
                      </button>
                      <button className="bg-red-500/10 border-2 border-red-500/20 text-red-500 p-4 rounded-2xl font-bold flex flex-col items-center gap-2 hover:bg-red-500/20 transition-all opacity-50">
                        <ArrowDownRight size={24} />
                        SELL / SHORT
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Asset Pair</label>
                        <select className="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-white font-bold focus:border-brand-primary outline-none transition-all">
                          <option>BTC-USD</option>
                          <option>ETH-USD</option>
                          <option>SOL-USD</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Order Type</label>
                          <select className="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-white font-bold focus:border-brand-primary outline-none transition-all">
                            <option>Market</option>
                            <option>Limit</option>
                            <option>Stop</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Quantity</label>
                          <input type="number" placeholder="0.00" className="w-full bg-black/40 border border-gray-800 rounded-xl p-4 text-white font-mono focus:border-brand-primary outline-none transition-all" />
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-brand-primary text-bg-dark p-5 rounded-2xl font-bold text-lg hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-3">
                      Execute Market Order <Zap size={20} />
                    </button>

                    <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-800/50 flex items-center gap-3">
                      <ShieldCheck className="text-brand-primary" size={20} />
                      <p className="text-[10px] text-gray-400 leading-relaxed">
                        Order will be routed through the <span className="text-white font-bold">Tradefy Smart Router</span> for best execution price and minimal slippage.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'strategies' && (
              <motion.div 
                key="strategies"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {activeStrategies.map(strat => (
                  <div key={strat.id} className="glass-card p-6 space-y-6 group hover:border-brand-primary/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5">
                          <Zap size={20} className={strat.status === 'Active' ? 'text-brand-primary' : 'text-gray-500'} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{strat.name}</h4>
                          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{strat.regime}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleStrategy(strat.id)}
                        className={`p-2 rounded-lg transition-all ${strat.status === 'Active' ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                      >
                        {strat.status === 'Active' ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/20 p-3 rounded-xl border border-gray-800">
                        <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Session PnL</p>
                        <p className={`text-sm font-bold font-mono ${strat.pnl >= 0 ? 'text-brand-primary' : 'text-red-400'}`}>
                          {strat.pnl >= 0 ? '+' : ''}${strat.pnl}
                        </p>
                      </div>
                      <div className="bg-black/20 p-3 rounded-xl border border-gray-800">
                        <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Status</p>
                        <p className={`text-sm font-bold ${strat.status === 'Active' ? 'text-green-500' : 'text-gray-500'}`}>{strat.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${strat.status === 'Active' ? 'bg-brand-primary w-full animate-pulse' : 'bg-gray-700 w-0'}`} />
                      </div>
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">
                        {strat.status === 'Active' ? 'Running' : 'Idle'}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="glass-card border-dashed border-gray-800 flex flex-col items-center justify-center gap-3 p-8 group hover:border-brand-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-brand-primary/10 transition-all">
                    <Plus className="text-gray-500 group-hover:text-brand-primary" />
                  </div>
                  <span className="text-sm font-bold text-gray-500 group-hover:text-white transition-colors">Launch New Strategy</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Activity & Performance */}
        <div className="lg:col-span-4 space-y-6">
          {/* Performance HUD */}
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-brand-primary" /> Session Performance
            </h3>
            <div className="space-y-4">
              <HUDStat label="Win Rate" value="68.2%" color="text-brand-primary" />
              <HUDStat label="Profit Factor" value="2.14" />
              <HUDStat label="Avg Trade" value="+$142.50" color="text-brand-primary" />
              <HUDStat label="Max Drawdown" value="-4.2%" color="text-red-400" />
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass-card p-0 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History size={16} className="text-brand-primary" /> Activity Log
              </h3>
              <button className="text-[10px] text-gray-500 hover:text-white uppercase font-bold tracking-widest">Clear</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[11px]">
              {logs.map(log => (
                <div key={log.id} className="flex gap-3 group">
                  <span className="text-gray-600 shrink-0">{log.time}</span>
                  <p className={`leading-relaxed ${
                    log.type === 'execution' ? 'text-brand-primary' : 
                    log.type === 'risk' ? 'text-yellow-500' : 
                    'text-gray-400'
                  }`}>
                    <span className="opacity-50 mr-1">[{log.type.toUpperCase()}]</span>
                    {log.msg}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-black/40 border-t border-gray-800 text-[10px] text-gray-600 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live stream active...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
        active 
          ? 'bg-brand-primary text-bg-dark shadow-lg shadow-brand-primary/20' 
          : 'text-gray-500 hover:text-white'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function HUDStat({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{label}</span>
      <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
    </div>
  );
}
