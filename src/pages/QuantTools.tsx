import React, { useState } from 'react';
import { Map, BarChart3, CircleDot, LayoutGrid } from 'lucide-react';
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
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);
  const [hoveredBubble, setHoveredBubble] = useState<any>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Quant Tools</h2>
      
      <div className="flex gap-2 p-1 bg-gray-900 rounded-lg w-fit">
        {[
          { id: 'geo-map', label: 'Geographic Coverage', icon: Map },
          { id: 'market-data', label: 'Market Data', icon: BarChart3 },
          { id: 'stock-bubbles', label: 'Stock Bubbles', icon: CircleDot },
          { id: 'market-treemap', label: 'Market Treemap', icon: LayoutGrid },
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
              <label className="text-sm text-gray-300">Min Coverage: {minCoverage}%</label>
              <input 
                type="range" min="0" max="50" value={minCoverage} 
                onChange={(e) => setMinCoverage(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
            </div>

            <div className="bg-black rounded-lg p-4 relative">
              <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryData = coverageData.find(c => c.id === geo.id);
                      const isVisible = countryData ? countryData.coverage >= minCoverage : false;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isVisible ? colorScale(countryData!.coverage) : "#333"}
                          stroke="#000"
                          onMouseEnter={() => countryData && setHoveredCountry(countryData)}
                          onMouseLeave={() => setHoveredCountry(null)}
                          style={{ default: { outline: 'none' }, hover: { fill: '#fff', outline: 'none' } }}
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

            <div className="flex items-center gap-2 justify-center">
              <span className="text-xs text-gray-400">Low</span>
              <div className="w-48 h-4 rounded" style={{ background: 'linear-gradient(to right, #ff0000, #00ff00)' }}></div>
              <span className="text-xs text-gray-400">High</span>
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
      </div>
    </div>
  );
};
