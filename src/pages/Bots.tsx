import React from 'react';
import { BrainCircuit, Play, Pause, Square } from 'lucide-react';

export const Bots: React.FC = () => {
  const bots = [
    { id: 'B-001', name: 'BTC Scalper', status: 'active', pnl: 1200 },
    { id: 'B-002', name: 'ETH Trend', status: 'paused', pnl: -150 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Trading Bots</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bots.map(bot => (
          <div key={bot.id} className="glass-card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BrainCircuit className="text-brand-primary" size={32} />
              <div>
                <h3 className="font-bold text-white">{bot.name}</h3>
                <p className="text-sm text-gray-400">Status: {bot.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {bot.status === 'active' ? <Pause size={20} /> : <Play size={20} />}
              <Square size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
