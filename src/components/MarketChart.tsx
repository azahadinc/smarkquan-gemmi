import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { MarketData, MarketRegime } from '../types';
import { formatCurrency } from '../lib/utils';
import { BrainCircuit, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MarketChartProps {
  data: MarketData[];
  regime?: MarketRegime;
}

export const MarketChart: React.FC<MarketChartProps> = ({ data, regime = 'TRENDING_UP' }) => {
  const domain = useMemo(() => {
    const prices = data.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.1;
    return [min - padding, max + padding];
  }, [data]);

  return (
    <div className="h-[400px] w-full glass-card">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-200">BTC/USDT Live Feed</h3>
          <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
            <BrainCircuit size={14} className="text-brand-secondary" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Regime:</span>
            <div className="flex items-center gap-1">
              {regime === 'TRENDING_UP' ? <TrendingUp size={12} className="text-brand-primary" /> :
               regime === 'TRENDING_DOWN' ? <TrendingDown size={12} className="text-brand-danger" /> :
               <Minus size={12} className="text-gray-400" />}
              <span className={`text-[10px] font-bold ${
                regime === 'TRENDING_UP' ? 'text-brand-primary' :
                regime === 'TRENDING_DOWN' ? 'text-brand-danger' :
                'text-gray-400'
              }`}>
                {regime.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          <span className="text-xs text-gray-400 font-mono">LIVE</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff9d" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00ff9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#242428" vertical={false} />
          <XAxis
            dataKey="time"
            hide
          />
          <YAxis
            domain={domain}
            orientation="right"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(val) => `$${val.toLocaleString()}`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#141417',
              border: '1px solid #242428',
              borderRadius: '8px',
            }}
            itemStyle={{ color: '#00ff9d' }}
            formatter={(value: number) => [formatCurrency(value), 'Price']}
            labelStyle={{ display: 'none' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#00ff9d"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
