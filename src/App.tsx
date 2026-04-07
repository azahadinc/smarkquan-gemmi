import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Auth } from './pages/Auth';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { DashboardLayout } from './components/DashboardLayout';
import { TradeHistory } from './pages/TradeHistory';
import { Strategies } from './pages/Strategies';
import { StrategyDetail } from './pages/StrategyDetail';
import { StrategyEditor } from './pages/StrategyEditor';
import { QuantTools } from './pages/QuantTools';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { LivePerformances } from './pages/LivePerformances';
import { Bots } from './pages/Bots';
import { MarketData, PerformanceStats as StatsType, Strategy, MarketRegime } from './types';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [currentRegime, setCurrentRegime] = useState<MarketRegime>('TRENDING_UP');
  const [strategies, setStrategies] = useState<Strategy[]>([
    { id: 'S-001', name: 'BTC Trend Follower', status: 'active', pnl: 12450.50, regime: 'TRENDING_UP' },
    { id: 'S-002', name: 'ETH Mean Reversion', status: 'active', pnl: -2340.20, regime: 'RANGING' },
    { id: 'S-003', name: 'SOL Volatility Scalper', status: 'paused', pnl: 5600.00, regime: 'VOLATILE' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marketRes, statsRes] = await Promise.all([
          fetch('/api/market-data'),
          fetch('/api/performance')
        ]);
        const market = await marketRes.json();
        const performance = await statsRes.json();
        setMarketData(market);
        setStats(performance);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();

    const regimes: MarketRegime[] = ['TRENDING_UP', 'TRENDING_DOWN', 'RANGING', 'VOLATILE'];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setCurrentRegime(regimes[Math.floor(Math.random() * regimes.length)]);
      }
      
      setMarketData(prev => {
        const last = prev[prev.length - 1];
        if (!last) return prev;
        const nextPrice = last.price + (Math.random() * 100 - 50);
        const next = {
          time: new Date().toISOString(),
          price: nextPrice,
          volume: Math.floor(Math.random() * 100)
        };
        return [...prev.slice(1), next];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard marketData={marketData} stats={stats} strategies={strategies} currentRegime={currentRegime} />} />
          <Route path="/history" element={<TradeHistory />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/strategies/:id" element={<StrategyDetail />} />
          <Route path="/strategy-editor" element={<StrategyEditor />} />
          <Route path="/quanttools" element={<QuantTools />} />
          <Route path="/live-performance" element={<LivePerformances />} />
          <Route path="/bots" element={<Bots />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

