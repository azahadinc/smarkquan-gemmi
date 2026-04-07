import React, { useState } from 'react';
import { Map, BarChart3, CircleDot } from 'lucide-react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

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

export const QuantTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState('geo-map');
  const [minCoverage, setMinCoverage] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Quant Tools</h2>
      
      <div className="flex gap-2 p-1 bg-gray-900 rounded-lg w-fit">
        {[
          { id: 'geo-map', label: 'Geographic Coverage', icon: Map },
          { id: 'market-data', label: 'Market Data', icon: BarChart3 },
          { id: 'stock-bubbles', label: 'Stock Bubbles', icon: CircleDot },
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
            <div className="h-64 flex items-center justify-center gap-4">
              {[ { size: 120, color: 'bg-brand-primary' }, { size: 80, color: 'bg-brand-secondary' }, { size: 100, color: 'bg-brand-danger' } ].map((bubble, i) => (
                <div key={i} className={`${bubble.color} rounded-full opacity-70`} style={{ width: bubble.size, height: bubble.size }}></div>
              ))}
            </div>
            <p className="text-center text-gray-400">Visual representation of market capitalization and volatility.</p>
          </div>
        )}
      </div>
    </div>
  );
};
