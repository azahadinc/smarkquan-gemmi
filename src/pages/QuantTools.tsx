import React, { useState } from 'react';
import { Map, BarChart3, CircleDot, LayoutGrid, ShieldAlert, Settings, Activity, PieChart, ShieldCheck, Zap } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { motion } from 'motion/react';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const coverageData = [
  { id: "USA", name: "United States", coverage: 26.1 },
  { id: "CHN", name: "China", coverage: 32.8 },
  { id: "IND", name: "India", coverage: 17.1 },
  { id: "DEU", name: "Germany", coverage: 8.0 },
  { id: "JPN", name: "Japan", coverage: 47.8 },
  { id: "CAN", name: "Canada", coverage: 6.6 },
  { id: "BRA", name: "Brazil", coverage: 28.4 },
  { id: "ZAF", name: "South Africa", coverage: 28.2 },
  { id: "AUS", name: "Australia", coverage: 15.5 },
];

const colorScale = scaleLinear<string>()
  .domain([0, 50])
  .range(["#ff0000", "#00ff00"]);

const getVolatilityColor = (vol: number) => {
  if (vol < 2) return '#22c55e'; // green-500
  if (vol < 4) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
};

export const QuantTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState('geo-map');
  const [minCoverage, setMinCoverage] = useState(0);
  const [maxCoverage, setMaxCoverage] = useState(100);
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);
  const [hoveredBubble, setHoveredBubble] = useState<any>(null);

  const legendRanges = [
    { label: '0-10%', min: 0, max: 10, color: colorScale(5) },
    { label: '10-25%', min: 10, max: 25, color: colorScale(17) },
    { label: '25-40%', min: 25, max: 40, color: colorScale(32) },
    { label: '40%+', min: 40, max: 100, color: colorScale(47) },
  ];

  const handleRangeClick = (range: { min: number, max: number }) => {
    if (minCoverage === range.min && maxCoverage === range.max) {
      // Reset if clicking the same range
      setMinCoverage(0);
      setMaxCoverage(100);
    } else {
      setMinCoverage(range.min);
      setMaxCoverage(range.max);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Quant Tools</h2>
      
      <div className="flex gap-2 p-1 bg-gray-900 rounded-lg w-fit">
        {[
          { id: 'geo-map', label: 'Geographic Coverage', icon: Map },
          { id: 'market-data', label: 'Market Data', icon: BarChart3 },
          { id: 'stock-bubbles', label: 'Stock Bubbles', icon: CircleDot },
          { id: 'market-treemap', label: 'Market Treemap', icon: LayoutGrid },
          { id: 'advanced-execution', label: 'Advanced Execution', icon: ShieldAlert },
          { id: 'portfolio-risk', label: 'Portfolio & Risk', icon: PieChart },
        ].map(tool => (
          <button 
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${activeTool === tool.id ? 'bg-brand-primary text-bg-dark font-bold' : 'text-gray-400 hover:text-white'}`}
          >
            <tool.icon size={18} /> {tool.label}
          </button>
        ))}
      </div>
        
      <div className="glass-card p-6">
        {activeTool === 'geo-map' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">ESG Geographic Coverage</h3>
            
            <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Min Coverage: {minCoverage}%</span>
                  <span>Max Coverage: {maxCoverage}%</span>
                </div>
                <input 
                  type="range" min="0" max="50" value={minCoverage} 
                  onChange={(e) => setMinCoverage(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>
              <button 
                onClick={() => { setMinCoverage(0); setMaxCoverage(100); }}
                className="text-xs text-brand-primary hover:underline"
              >
                Reset Filter
              </button>
            </div>

            <div className="bg-black rounded-lg p-4 relative">
              <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryData = coverageData.find(c => c.id === geo.id);
                      const isVisible = countryData ? (countryData.coverage >= minCoverage && countryData.coverage <= maxCoverage) : false;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isVisible ? colorScale(countryData!.coverage) : "#333"}
                          stroke="#000"
                          strokeWidth={0.5}
                          onMouseEnter={() => countryData && setHoveredCountry(countryData)}
                          onMouseLeave={() => setHoveredCountry(null)}
                          style={{ 
                            default: { outline: 'none' }, 
                            hover: { fill: '#fff', stroke: '#fff', strokeWidth: 1, outline: 'none', cursor: 'pointer' } 
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>

              {hoveredCountry && (
                <div className="absolute top-4 right-4 bg-gray-900 p-3 rounded shadow-lg border border-gray-700 text-white">
                  <p className="font-bold">{hoveredCountry.name}</p>
                  <p className="text-brand-primary">Coverage: {hoveredCountry.coverage}%</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                {legendRanges.map((range, i) => {
                  const isActive = minCoverage === range.min && maxCoverage === range.max;
                  return (
                    <button
                      key={i}
                      onClick={() => handleRangeClick(range)}
                      className={`group flex flex-col items-center gap-1 transition-all ${isActive ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                    >
                      <div 
                        className={`w-12 h-4 rounded border ${isActive ? 'border-white' : 'border-transparent'}`}
                        style={{ backgroundColor: range.color }}
                      ></div>
                      <span className={`text-[10px] ${isActive ? 'text-white font-bold' : 'text-gray-500'}`}>
                        {range.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 italic">Click swatches to filter by range</p>
            </div>
          </div>
        )}

        {activeTool === 'market-data' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Market Data Overview</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'S&P 500', change: '-0.84%', color: 'text-red-500' },
                { name: 'Communications', change: '+0.01%', color: 'text-green-500' },
                { name: 'ICE Brent Crude', change: '-1.73%', color: 'text-red-500' },
                { name: 'Fed Fund Rate', current: '0.13', prev: '0.12' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <p className="text-gray-400 text-sm">{item.name}</p>
                  <p className={`text-xl font-bold ${item.color || 'text-white'}`}>
                    {item.change || `${item.current} (${item.prev})`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTool === 'stock-bubbles' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Stock Bubbles</h3>
            <div className="h-96 flex items-center justify-center gap-4 relative">
              {[ 
                { ticker: 'AAPL', name: 'Apple Inc.', cap: 2800, vol: 1.2 }, 
                { ticker: 'TSLA', name: 'Tesla, Inc.', cap: 700, vol: 4.5 }, 
                { ticker: 'NVDA', name: 'NVIDIA Corp.', cap: 1200, vol: 3.2 } 
              ].map((bubble, i) => (
                <motion.div 
                  key={i} 
                  className="rounded-full flex items-center justify-center cursor-pointer"
                  style={{ 
                    width: bubble.cap / 10, 
                    height: bubble.cap / 10,
                    backgroundColor: getVolatilityColor(bubble.vol)
                  }}
                  whileHover={{ scale: 1.1 }}
                  onMouseEnter={() => setHoveredBubble(bubble)}
                  onMouseLeave={() => setHoveredBubble(null)}
                >
                  <span className="text-white font-bold text-xs">{bubble.ticker}</span>
                </motion.div>
              ))}
              {hoveredBubble && (
                <div className="absolute top-4 right-4 bg-gray-900 p-4 rounded-lg border border-gray-700 text-white shadow-xl">
                  <p className="font-bold text-lg">{hoveredBubble.name} ({hoveredBubble.ticker})</p>
                  <p>Market Cap: ${hoveredBubble.cap}B</p>
                  <p>Volatility: {hoveredBubble.vol}%</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div> Low Volatility
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div> Medium Volatility
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div> High Volatility
              </div>
            </div>
            <p className="text-center text-gray-400 text-sm">Bubble size represents Market Cap. Color represents Volatility.</p>
          </div>
        )}

        {activeTool === 'market-treemap' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Market Treemap</h3>
            <div className="h-96 grid grid-cols-4 grid-rows-3 gap-2">
              {[
                { name: 'BTC', change: 2.5, color: 'bg-green-600' },
                { name: 'ETH', change: 1.2, color: 'bg-green-500' },
                { name: 'SOL', change: -3.4, color: 'bg-red-600' },
                { name: 'ADA', change: 0.5, color: 'bg-green-400' },
                { name: 'DOT', change: -1.1, color: 'bg-red-500' },
                { name: 'DOGE', change: 5.2, color: 'bg-green-700' },
                { name: 'AVAX', change: -2.0, color: 'bg-red-500' },
                { name: 'LINK', change: 0.8, color: 'bg-green-400' },
                { name: 'UNI', change: -0.5, color: 'bg-red-400' },
                { name: 'MATIC', change: 1.5, color: 'bg-green-500' },
                { name: 'XRP', change: -1.8, color: 'bg-red-500' },
                { name: 'LTC', change: 0.2, color: 'bg-green-400' },
              ].map((item, i) => (
                <div key={i} className={`${item.color} p-2 rounded flex flex-col justify-between text-white`}>
                  <span className="font-bold">{item.name}</span>
                  <span className="text-xs">{item.change}%</span>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400">Visual representation of market performance.</p>
          </div>
        )}

        {activeTool === 'advanced-execution' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Advanced Execution & Fail-safes</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <Activity size={14} className="text-green-500" />
                <span className="text-xs font-bold text-green-500 uppercase tracking-wider">System Heartbeat: Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* OMS Section */}
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-center gap-2 text-brand-primary">
                  <Settings size={20} />
                  <h4 className="font-bold">Order Management (OMS)</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-black/40 rounded-xl border border-gray-800">
                    <span className="text-gray-400 text-sm">Supported Types</span>
                    <div className="flex gap-2">
                      {['LIMIT', 'STOP', 'OCO', 'TRAILING'].map(t => (
                        <span key={t} className="text-[10px] bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded border border-brand-primary/20">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-sm mb-2">Active Orders</p>
                    <div className="text-center py-4 text-gray-600 text-xs italic">No pending orders in queue</div>
                  </div>
                </div>
              </div>

              {/* Friction Modeling */}
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-center gap-2 text-brand-secondary">
                  <BarChart3 size={20} />
                  <h4 className="font-bold">Slippage & Latency Modeling</h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Slippage Model</span>
                      <span className="text-white font-mono">Market Impact (Square Root)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-brand-secondary"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Execution Latency</span>
                      <span className="text-white font-mono">45ms (Simulated)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className="w-1/4 h-full bg-brand-secondary"></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    * Backtester accounts for market impact on orders &gt; $500k.
                  </p>
                </div>
              </div>
            </div>

            {/* Fail-safes */}
            <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-red-400">
                <ShieldAlert size={20} />
                <h4 className="font-bold">Connectivity Fail-safes</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                  <p className="text-gray-500 text-[10px] uppercase mb-1">Auto-Flatten</p>
                  <p className="text-white font-bold text-sm">ENABLED</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                  <p className="text-gray-500 text-[10px] uppercase mb-1">Alert Channel</p>
                  <p className="text-white font-bold text-sm">TELEGRAM / DISCORD</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                  <p className="text-gray-500 text-[10px] uppercase mb-1">Timeout Threshold</p>
                  <p className="text-white font-bold text-sm">15,000 MS</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'portfolio-risk' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Portfolio Optimization & Risk Control</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
                <ShieldCheck size={14} className="text-brand-primary" />
                <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Risk Manager: Online</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Optimization */}
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-center gap-2 text-brand-primary">
                  <PieChart size={20} />
                  <h4 className="font-bold">Modern Portfolio Theory (MPT)</h4>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Optimal Allocation (Min Volatility)</p>
                    <div className="space-y-3">
                      {[
                        { symbol: 'BTC', weight: 45, color: 'bg-orange-500' },
                        { symbol: 'ETH', weight: 35, color: 'bg-blue-500' },
                        { symbol: 'SOL', weight: 20, color: 'bg-purple-500' },
                      ].map(asset => (
                        <div key={asset.symbol} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white font-bold">{asset.symbol}</span>
                            <span className="text-gray-400">{asset.weight}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full ${asset.color}`} style={{ width: `${asset.weight}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    * Weights calculated using Inverse-Variance Optimization to minimize portfolio variance.
                  </p>
                </div>
              </div>

              {/* Position Sizing */}
              <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 space-y-4">
                <div className="flex items-center gap-2 text-brand-secondary">
                  <Zap size={20} />
                  <h4 className="font-bold">Dynamic Position Sizing</h4>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-gray-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Kelly Criterion (f*)</span>
                    <span className="text-brand-secondary font-mono font-bold text-lg">0.182</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-[10px] text-gray-500 uppercase">Win Prob</p>
                      <p className="text-white font-bold">64%</p>
                    </div>
                    <div className="p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                      <p className="text-[10px] text-gray-500 uppercase">Win/Loss Ratio</p>
                      <p className="text-white font-bold">1.85</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    The Kelly Criterion suggests allocating 18.2% of capital to the next trade based on current strategy performance.
                  </p>
                </div>
              </div>
            </div>

            {/* Circuit Breaker */}
            <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-red-400">
                  <ShieldAlert size={20} />
                  <h4 className="font-bold">Portfolio Circuit Breaker</h4>
                </div>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 font-bold">FAIL-SAFE ACTIVE</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">Daily Drawdown Limit</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">5.0</span>
                    <span className="text-gray-500 mb-1">%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full">
                    <div className="w-1/2 h-full bg-red-500"></div>
                  </div>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-gray-800 flex flex-col justify-center">
                  <p className="text-gray-500 text-[10px] uppercase mb-1">Current Drawdown</p>
                  <p className="text-green-400 font-bold text-xl">0.42%</p>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-gray-800 flex flex-col justify-center">
                  <p className="text-gray-500 text-[10px] uppercase mb-1">Action on Trigger</p>
                  <p className="text-white font-bold text-sm">FLATTEN & HALT</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
