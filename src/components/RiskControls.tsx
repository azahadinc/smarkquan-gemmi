import React from 'react';
import { Shield, Zap, AlertTriangle } from 'lucide-react';

export const RiskControls: React.FC = () => {
  return (
    <div className="glass-card">
      <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center gap-2">
        <Shield size={20} className="text-brand-primary" />
        Risk Management
      </h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="text-gray-400">Daily Drawdown Limit</label>
            <span className="text-brand-danger font-mono">-2.5%</span>
          </div>
          <input 
            type="range" 
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-danger"
            min="0.5"
            max="10"
            step="0.5"
            defaultValue="2.5"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <label className="text-gray-400">Max Position Size</label>
            <span className="text-brand-secondary font-mono">15.0%</span>
          </div>
          <input 
            type="range" 
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-brand-secondary"
            min="1"
            max="50"
            step="1"
            defaultValue="15"
          />
        </div>

        <div className="pt-4 border-t border-gray-800 space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-brand-danger/10 border border-brand-danger/20 text-brand-danger hover:bg-brand-danger/20 transition-all">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} />
              <span className="text-sm font-bold uppercase">Emergency Stop</span>
            </div>
            <Zap size={16} />
          </button>
          <p className="text-[10px] text-gray-500 text-center italic">
            Instantly flattens all positions and kills active bots.
          </p>
        </div>
      </div>
    </div>
  );
};
