import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Plus, Edit2, X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="glass-card w-full max-w-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Edit Strategy</h3>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        {error && <p className="text-brand-danger text-sm">{error}</p>}
        <input placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-800 p-2 rounded text-white" />
        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-800 p-2 rounded text-white">
          <option>Active</option>
          <option>Paused</option>
          <option>Stopped</option>
        </select>
        <input type="number" placeholder="Take Profit (%)" value={formData.takeProfit || ''} onChange={(e) => setFormData({...formData, takeProfit: parseFloat(e.target.value)})} className="w-full bg-gray-800 p-2 rounded text-white" />
        <input type="number" placeholder="Stop Loss (%)" value={formData.stopLoss || ''} onChange={(e) => setFormData({...formData, stopLoss: parseFloat(e.target.value)})} className="w-full bg-gray-800 p-2 rounded text-white" />
        <input type="number" placeholder="MA Period" value={formData.ma_period || ''} onChange={(e) => setFormData({...formData, ma_period: parseInt(e.target.value)})} className="w-full bg-gray-800 p-2 rounded text-white" />
        <button onClick={handleSave} className="w-full bg-brand-primary text-bg-dark p-2 rounded font-bold">Save</button>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Strategy Management</h2>
        <button 
          onClick={() => navigate('/strategy-editor')}
          className="flex items-center gap-2 bg-brand-primary text-bg-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-primary/90 transition-all"
        >
          <Plus size={18} /> New Strategy
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map(strat => (
          <div key={strat.id} className="glass-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <BrainCircuit size={32} className="text-brand-secondary" />
              <div>
                <h3 className="font-bold text-white">{strat.name}</h3>
                <p className="text-xs text-gray-500 font-mono">ID: {strat.id}</p>
                <p className="text-sm text-gray-400">Status: {strat.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingStrategy(strat)} className="p-2 text-gray-400 hover:text-white"><Edit2 size={18} /></button>
              <Link to={`/strategies/${strat.id}`} className="bg-gray-800 text-white px-3 py-1 rounded text-sm">View</Link>
            </div>
          </div>
        ))}
      </div>
      {editingStrategy && <EditModal strategy={editingStrategy} onClose={() => setEditingStrategy(null)} onSave={saveStrategy} />}
    </div>
  );
};
