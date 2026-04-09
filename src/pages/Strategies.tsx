import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Plus, Edit2, X, Sparkles, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

const EditModal = ({ strategy, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({ ...strategy });
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!formData.name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    if (!['Active', 'Paused', 'Stopped'].includes(formData.status)) {
      setError('Invalid status');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-6 space-y-4 border-brand-primary/20">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Edit Strategy</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-white transition-colors" /></button>
        </div>
        {error && <p className="text-brand-danger text-sm font-bold">{error}</p>}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Strategy Name</label>
            <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white focus:border-brand-primary outline-none transition-all" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Execution Status</label>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white focus:border-brand-primary outline-none transition-all">
              <option>Active</option>
              <option>Paused</option>
              <option>Stopped</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Take Profit (%)</label>
              <input type="number" value={formData.takeProfit || ''} onChange={(e) => setFormData({...formData, takeProfit: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white focus:border-brand-primary outline-none transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Stop Loss (%)</label>
              <input type="number" value={formData.stopLoss || ''} onChange={(e) => setFormData({...formData, stopLoss: parseFloat(e.target.value)})} className="w-full bg-gray-900 border border-gray-800 p-3 rounded-xl text-white focus:border-brand-primary outline-none transition-all" />
            </div>
          </div>
        </div>
        <button onClick={handleSave} className="w-full bg-brand-primary text-bg-dark p-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20">Save Changes</button>
      </div>
    </div>
  );
};

export const Strategies: React.FC = () => {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<any[]>([
    { id: 'S-001', name: 'BTC Trend Follower', status: 'Active', takeProfit: 5, stopLoss: 2, ma_period: 20 },
    { id: 'S-002', name: 'ETH Mean Reversion', status: 'Paused', takeProfit: 3, stopLoss: 1, ma_period: 50 },
  ]);
  const [editingStrategy, setEditingStrategy] = useState<any>(null);

  const saveStrategy = (updated: any) => {
    setStrategies(strategies.map(s => s.id === updated.id ? updated : s));
    setEditingStrategy(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Strategy Management</h2>
          <p className="text-gray-400 text-sm">Design, backtest, and deploy your quantitative edge.</p>
        </div>
        <button 
          onClick={() => navigate('/strategy-editor')}
          className="flex items-center gap-2 bg-brand-primary text-bg-dark px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
        >
          <Plus size={18} /> New Strategy
        </button>
      </div>

      {/* TradefyGPT Quick Start */}
      <div className="bg-gradient-to-r from-brand-primary/10 to-purple-500/10 border border-brand-primary/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center border border-brand-primary/30 shadow-inner">
            <Sparkles className="text-brand-primary" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Generate with TradefyGPT</h3>
            <p className="text-gray-400 text-sm max-w-md">
              Describe your strategy in plain English and our AI will generate a production-ready Jesse-style Python script for you.
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/strategy-editor')}
          className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center gap-2"
        >
          Start AI Assistant <Zap size={16} className="text-brand-primary" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map(strat => (
          <div key={strat.id} className="glass-card flex flex-col gap-6 p-6 group hover:border-brand-primary/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-brand-primary/20 transition-all">
                  <BrainCircuit size={24} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{strat.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">ID: {strat.id}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                strat.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                strat.status === 'Paused' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}>
                {strat.status}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/20 p-3 rounded-xl border border-gray-800">
                <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Win Rate</p>
                <p className="text-white font-bold text-sm">64.2%</p>
              </div>
              <div className="bg-black/20 p-3 rounded-xl border border-gray-800">
                <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Profit Factor</p>
                <p className="text-white font-bold text-sm">1.85</p>
              </div>
              <div className="bg-black/20 p-3 rounded-xl border border-gray-800">
                <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-1">Total PnL</p>
                <p className="text-brand-primary font-bold text-sm">+12.4%</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <TrendingUp size={12} /> 24h: +1.2%
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <ShieldCheck size={12} className="text-green-500" /> Secure
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingStrategy(strat)} className="p-2 text-gray-400 hover:text-white transition-colors"><Edit2 size={18} /></button>
                <Link to={`/strategies/${strat.id}`} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition-all">View Analytics</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingStrategy && <EditModal strategy={editingStrategy} onClose={() => setEditingStrategy(null)} onSave={saveStrategy} />}
    </div>
  );
};
