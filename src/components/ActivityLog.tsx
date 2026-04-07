import React from 'react';
import { Terminal, Clock, Info } from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  type: 'INFO' | 'TRADE' | 'ERROR' | 'SYSTEM';
  message: string;
}

export const ActivityLog: React.FC = () => {
  const logs: LogEntry[] = [
    { id: '1', time: '16:12:04', type: 'TRADE', message: 'BTC/USDT: LONG 0.5 BTC @ $64,200.00' },
    { id: '2', time: '16:11:58', type: 'INFO', message: 'Regime shift detected: TRENDING_UP (Confidence: 84%)' },
    { id: '3', time: '16:10:45', type: 'SYSTEM', message: 'Heartbeat check: OK' },
    { id: '4', time: '16:08:12', type: 'TRADE', message: 'ETH/USDT: SHORT 10.0 ETH @ $3,450.00' },
    { id: '5', time: '16:05:30', type: 'ERROR', message: 'Binance API: Rate limit warning (80%)' },
  ];

  return (
    <div className="glass-card h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <Terminal size={18} className="text-brand-secondary" />
          System Logs
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <Clock size={12} />
          <span>UTC: {new Date().toISOString().slice(11, 19)}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[11px]">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 p-1 hover:bg-gray-800/50 rounded transition-colors group">
            <span className="text-gray-600 shrink-0">[{log.time}]</span>
            <span className={`font-bold shrink-0 ${
              log.type === 'TRADE' ? 'text-brand-primary' :
              log.type === 'ERROR' ? 'text-brand-danger' :
              log.type === 'SYSTEM' ? 'text-brand-secondary' :
              'text-gray-400'
            }`}>
              {log.type}
            </span>
            <span className="text-gray-300 group-hover:text-white transition-colors">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
