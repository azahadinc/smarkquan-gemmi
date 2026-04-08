import React from 'react';
import { Plus, BrainCircuit, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarketData, PerformanceStats as StatsType, Strategy, MarketRegime } from '../types';
import { LiveFeed } from '../components/LiveFeed';

interface DashboardProps {
  marketData: MarketData[];
  stats: StatsType | null;
  strategies: Strategy[];
  currentRegime: MarketRegime;
}

export const Dashboard: React.FC<DashboardProps> = ({ marketData, stats, strategies, currentRegime }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currently Trading */}
        <div className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <p className="text-gray-400">Currently Trading</p>
          <h2 className="text-4xl font-bold text-white">$26.615,79</h2>
          <div className="flex gap-8 mt-4">
            <div><p className="text-gray-500 text-sm">Live Strategies</p><p className="text-xl font-bold text-white">4</p></div>
            <div><p className="text-gray-500 text-sm">Assets</p><p className="text-xl font-bold text-white">3</p></div>
          </div>
        </div>
        
        {/* Live Feed Integration */}
        <div className="lg:col-span-2">
          <LiveFeed />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Chart */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400">Balance</p>
            <p className="text-brand-primary font-bold">+ $250,22 /24h</p>
          </div>
          <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-600">[Chart Placeholder]</div>
        </div>
        {/* Allocation */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <p className="text-gray-400 mb-4">Allocation</p>
          <div className="h-32 bg-gray-800 rounded-full flex items-center justify-center text-gray-600">[Donut Chart Placeholder]</div>
        </div>
      </div>

      {/* Active Strategies */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">ACTIVE STRATEGIES</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies.filter(s => s.status === 'active').map(s => (
            <div key={s.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <BrainCircuit className="text-brand-primary" size={20} />
                </div>
                <span className="bg-brand-primary/20 text-brand-primary text-xs px-2 py-1 rounded">LIVE</span>
              </div>
              <h4 className="font-bold text-white">{s.name}</h4>
              <p className="text-gray-500 text-sm mb-4">{s.id}, Live since Feb 12th</p>
              <div className="flex justify-between">
                <div><p className="text-gray-500 text-xs">Capital</p><p className="text-white font-bold">${s.pnl.toLocaleString()}</p></div>
                <div><p className="text-gray-500 text-xs">Gains</p><p className="text-brand-primary font-bold">+$1.250,74</p></div>
              </div>
            </div>
          ))}
          <button 
            onClick={() => navigate('/strategy-editor')}
            className="border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-brand-primary transition-all"
          >
            <Plus size={32} />
            <span className="font-bold">Create New Strategy</span>
          </button>
        </div>
      </div>

      {/* Draft Strategies */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">DRAFT STRATEGIES</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies.filter(s => s.status !== 'active').map(s => (
            <div key={s.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <BrainCircuit className="text-gray-500" size={20} />
                </div>
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded">DRAFT</span>
              </div>
              <h4 className="font-bold text-white">{s.name}</h4>
              <p className="text-gray-500 text-sm mb-4">{s.id}, Live since Feb 12th</p>
              <div className="flex justify-between">
                <div><p className="text-gray-500 text-xs">Capital</p><p className="text-white font-bold">${s.pnl.toLocaleString()}</p></div>
                <div><p className="text-gray-500 text-xs">Tradefy Score</p><p className="text-brand-secondary font-bold">★ 4.5</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
