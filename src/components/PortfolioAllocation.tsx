import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../lib/utils';

const data = [
  { name: 'BTC', value: 65000, color: '#00ff9d' },
  { name: 'ETH', value: 35000, color: '#00d4ff' },
  { name: 'SOL', value: 15000, color: '#a855f7' },
  { name: 'USDT', value: 27500, color: '#6b7280' },
];

export const PortfolioAllocation: React.FC = () => {
  return (
    <div className="glass-card h-[300px]">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Portfolio Allocation</h3>
      <div className="flex h-full">
        <div className="w-1/2">
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#141417', border: '1px solid #242428', borderRadius: '8px' }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 flex flex-col justify-center gap-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-400">{item.name}</span>
              </div>
              <span className="font-mono font-bold">{((item.value / 142500) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
