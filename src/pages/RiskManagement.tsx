import React, { useState } from 'react';
import { ShieldAlert, Calculator, PieChart, Power } from 'lucide-react';

export const RiskManagement: React.FC = () => {
  const [winRate, setWinRate] = useState(0.5);
  const [odds, setOdds] = useState(2.0);
  const [kellySize, setKellySize] = useState(0);
  const [drawdownThreshold, setDrawdownThreshold] = useState(10);
  const [isCircuitBreakerActive, setIsCircuitBreakerActive] = useState(false);

  const calculateKelly = () => {
    // Kelly Criterion: f* = (bp - q) / b
    // b = odds - 1, p = winRate, q = 1 - p
    const b = odds - 1;
    const q = 1 - winRate;
    const f = (b * winRate - q) / b;
    setKellySize(Math.max(0, f) * 100);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Risk Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kelly Criterion */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 text-brand-primary">
            <Calculator size={24} />
            <h3 className="text-xl font-bold text-white">Kelly Criterion Sizing</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" step="0.01" value={winRate} onChange={e => setWinRate(Number(e.target.value))} className="bg-gray-800 p-2 rounded" placeholder="Win Rate (0-1)" />
            <input type="number" step="0.1" value={odds} onChange={e => setOdds(Number(e.target.value))} className="bg-gray-800 p-2 rounded" placeholder="Odds (e.g. 2.0)" />
          </div>
          <button onClick={calculateKelly} className="w-full bg-brand-primary text-bg-dark font-bold py-2 rounded">Calculate Position Size</button>
          <p className="text-center text-lg">Recommended Size: <span className="font-bold text-brand-primary">{kellySize.toFixed(2)}%</span></p>
        </div>

        {/* Circuit Breaker */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3 text-brand-danger">
            <ShieldAlert size={24} />
            <h3 className="text-xl font-bold text-white">Circuit Breaker</h3>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-gray-400">Max Drawdown Threshold (%):</label>
            <input type="number" value={drawdownThreshold} onChange={e => setDrawdownThreshold(Number(e.target.value))} className="bg-gray-800 p-2 rounded w-20" />
          </div>
          <button 
            onClick={() => setIsCircuitBreakerActive(!isCircuitBreakerActive)}
            className={`w-full py-2 rounded font-bold flex items-center justify-center gap-2 ${isCircuitBreakerActive ? 'bg-brand-danger text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            <Power size={18} /> {isCircuitBreakerActive ? 'Circuit Breaker ACTIVE' : 'Activate Circuit Breaker'}
          </button>
        </div>
      </div>

      {/* Portfolio Optimization Placeholder */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 text-brand-secondary">
          <PieChart size={24} />
          <h3 className="text-xl font-bold text-white">Portfolio Optimization</h3>
        </div>
        <p className="text-gray-400">Advanced portfolio optimization algorithms (Mean-Variance, Black-Litterman) will be integrated here to balance risk and return across your assets.</p>
        <div className="h-32 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
          <p className="text-gray-600 italic">Optimization Visualization Placeholder</p>
        </div>
      </div>
    </div>
  );
};
