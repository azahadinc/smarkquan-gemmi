import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const TradeHistory: React.FC = () => {
  const trades = [
    { id: 'T-001', asset: 'BTC/USDT', type: 'LONG', price: 64200, amount: 0.5, time: '16:12:04' },
    { id: 'T-002', asset: 'ETH/USDT', type: 'SHORT', price: 3450, amount: 10.0, time: '16:08:12' },
  ];

  const backtestResults = {
    pnl: 15.4,
    trades: 42,
    sharpe: 2.1,
    drawdown: -4.2
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Trade History</h2>
      
      <div className="glass-card p-6 border-brand-primary/20 bg-brand-primary/5">
        <h3 className="text-xl font-bold text-brand-primary mb-4 flex items-center gap-2">
          <CheckCircle2 /> Recent Backtest Results
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <Stat label="Net PnL" value={`+${backtestResults.pnl}%`} color="text-brand-primary" />
          <Stat label="Trades" value={backtestResults.trades} />
          <Stat label="Sharpe" value={backtestResults.sharpe} />
          <Stat label="Drawdown" value={`${backtestResults.drawdown}%`} color="text-brand-danger" />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-500 uppercase bg-gray-800/50">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade.id} className="border-b border-gray-800">
                <td className="px-6 py-4 font-mono">{trade.id}</td>
                <td className="px-6 py-4 text-white">{trade.asset}</td>
                <td className={`px-6 py-4 font-bold ${trade.type === 'LONG' ? 'text-brand-primary' : 'text-brand-danger'}`}>{trade.type}</td>
                <td className="px-6 py-4 font-mono">{trade.price}</td>
                <td className="px-6 py-4 font-mono">{trade.amount}</td>
                <td className="px-6 py-4 font-mono">{trade.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function Stat({ label, value, color = "text-gray-200" }: { label: string, value: any, color?: string }) {
  return (
    <div className="bg-bg-dark p-3 rounded-lg border border-gray-800">
      <p className="text-[10px] text-gray-500 uppercase">{label}</p>
      <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
    </div>
  );
}
