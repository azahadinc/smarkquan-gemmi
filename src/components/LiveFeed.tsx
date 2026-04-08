import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceUpdate {
  symbol: string;
  price: number;
  timestamp: number;
}

interface Indicators {
  rsi?: number;
  macd?: {
    value: number;
    signal: number;
    histogram: number;
  };
}

export const LiveFeed: React.FC = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [indicators, setIndicators] = useState<Record<string, Indicators>>({});
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onopen = () => {
      setStatus('connected');
      console.log('WebSocket Connected');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'price_update') {
        setPrices(prev => ({ ...prev, [data.symbol]: data.price }));
        
        // Fetch features periodically or on update
        fetchFeatures(data.symbol);
      }
    };

    socket.onerror = () => setStatus('error');
    socket.onclose = () => setStatus('connecting');

    return () => socket.close();
  }, []);

  const fetchFeatures = async (symbol: string) => {
    try {
      const res = await fetch(`/api/features/${symbol}`);
      const data = await res.json();
      setIndicators(prev => ({ ...prev, [symbol]: data }));
    } catch (err) {
      console.error('Failed to fetch features', err);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Activity className="text-brand-primary" size={20} />
          <h3 className="text-xl font-bold text-white">Live Price Feed</h3>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${status === 'connected' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
          {status.toUpperCase()}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(prices).map(([symbol, price]) => {
          const currentPrice = price as number;
          return (
            <div key={symbol} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <div>
                <p className="text-white font-bold">{symbol}</p>
                <div className="flex gap-4 mt-1">
                  {indicators[symbol]?.rsi && (
                    <p className="text-xs text-gray-400">
                      RSI: <span className={indicators[symbol]!.rsi! > 70 ? 'text-red-400' : indicators[symbol]!.rsi! < 30 ? 'text-green-400' : 'text-brand-primary'}>
                        {indicators[symbol]!.rsi!.toFixed(2)}
                      </span>
                    </p>
                  )}
                  {indicators[symbol]?.macd && (
                    <p className="text-xs text-gray-400">
                      MACD: <span className={indicators[symbol]!.macd!.histogram > 0 ? 'text-green-400' : 'text-red-400'}>
                        {indicators[symbol]!.macd!.value.toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono font-bold text-white">
                  ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(currentPrice)}
                </p>
                <div className="flex items-center justify-end gap-1 text-xs text-green-400">
                  <TrendingUp size={12} />
                  <span>Live</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 mt-4 italic">
        * Data streamed via WebSocket manager and pre-calculated in Feature Store.
      </p>
    </div>
  );
};
