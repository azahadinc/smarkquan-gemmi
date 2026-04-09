import React, { useState, useMemo, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe as GlobeIcon, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ArrowLeft, 
  BarChart3, 
  Zap, 
  ShieldCheck,
  Search,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { scaleLinear } from 'd3-scale';

// Mock data for global market hubs
const marketHubs = [
  { 
    id: 'NYC', 
    name: 'New York', 
    lat: 40.7128, 
    lng: -74.0060, 
    size: 0.8, 
    color: '#22c55e',
    trends: { stock: '+1.2%', forex: 'USD Strength', commodities: 'Gold Up' },
    details: {
      marketStatus: 'Open',
      volatility: 'Low',
      topAssets: ['AAPL', 'MSFT', 'NVDA'],
      sentiment: 'Bullish',
      news: 'Fed maintains interest rates, tech sector rallies.'
    }
  },
  { 
    id: 'LON', 
    name: 'London', 
    lat: 51.5074, 
    lng: -0.1278, 
    size: 0.7, 
    color: '#3b82f6',
    trends: { stock: '-0.4%', forex: 'GBP Stable', commodities: 'Oil Down' },
    details: {
      marketStatus: 'Closed',
      volatility: 'Medium',
      topAssets: ['HSBA', 'BP', 'AZN'],
      sentiment: 'Neutral',
      news: 'UK GDP growth exceeds expectations slightly.'
    }
  },
  { 
    id: 'TKY', 
    name: 'Tokyo', 
    lat: 35.6762, 
    lng: 139.6503, 
    size: 0.6, 
    color: '#f59e0b',
    trends: { stock: '+0.8%', forex: 'JPY Weakness', commodities: 'Nikkei High' },
    details: {
      marketStatus: 'Open',
      volatility: 'High',
      topAssets: ['7203', '9984', '6758'],
      sentiment: 'Bullish',
      news: 'BOJ hints at policy shift, yen fluctuates.'
    }
  },
  { 
    id: 'HKG', 
    name: 'Hong Kong', 
    lat: 22.3193, 
    lng: 114.1694, 
    size: 0.6, 
    color: '#ef4444',
    trends: { stock: '-1.5%', forex: 'HKD Pegged', commodities: 'Hang Seng Low' },
    details: {
      marketStatus: 'Open',
      volatility: 'Very High',
      topAssets: ['0700', '9988', '1299'],
      sentiment: 'Bearish',
      news: 'Property sector concerns weigh on Hang Seng index.'
    }
  },
  { 
    id: 'SYD', 
    name: 'Sydney', 
    lat: -33.8688, 
    lng: 151.2093, 
    size: 0.5, 
    color: '#8b5cf6',
    trends: { stock: '+0.3%', forex: 'AUD Strong', commodities: 'Iron Ore Up' },
    details: {
      marketStatus: 'Closed',
      volatility: 'Low',
      topAssets: ['CBA', 'BHP', 'CSL'],
      sentiment: 'Neutral',
      news: 'Mining stocks lead modest gains in ASX 200.'
    }
  },
  { 
    id: 'FRA', 
    name: 'Frankfurt', 
    lat: 50.1109, 
    lng: 8.6821, 
    size: 0.6, 
    color: '#10b981',
    trends: { stock: '+0.5%', forex: 'EUR Stable', commodities: 'DAX Steady' },
    details: {
      marketStatus: 'Closed',
      volatility: 'Low',
      topAssets: ['SAP', 'SIE', 'VOW3'],
      sentiment: 'Bullish',
      news: 'German inflation data shows cooling trend.'
    }
  }
];

// Arcs to represent data flow/constellation
const arcsData = [
  { startLat: 40.7128, startLng: -74.0060, endLat: 51.5074, endLng: -0.1278, color: ['#22c55e', '#3b82f6'] },
  { startLat: 51.5074, startLng: -0.1278, endLat: 35.6762, endLng: 139.6503, color: ['#3b82f6', '#f59e0b'] },
  { startLat: 35.6762, startLng: 139.6503, endLat: 22.3193, endLng: 114.1694, color: ['#f59e0b', '#ef4444'] },
  { startLat: 22.3193, startLng: 114.1694, endLat: -33.8688, endLng: 151.2093, color: ['#ef4444', '#8b5cf6'] },
  { startLat: -33.8688, startLng: 151.2093, endLat: 40.7128, endLng: -74.0060, color: ['#8b5cf6', '#22c55e'] },
  { startLat: 40.7128, startLng: -74.0060, endLat: 35.6762, endLng: 139.6503, color: ['#22c55e', '#f59e0b'] },
];

export const Godeye: React.FC = () => {
  const globeRef = useRef<any>();
  const [selectedHub, setSelectedHub] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredHub, setHoveredHub] = useState<any>(null);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = !selectedHub;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, [selectedHub]);

  const handleHubClick = (hub: any) => {
    setSelectedHub(hub);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: hub.lat, lng: hub.lng, altitude: 1.5 }, 1000);
    }
  };

  const closeDetails = () => {
    setSelectedHub(null);
    if (globeRef.current) {
      globeRef.current.pointOfView({ altitude: 2.5 }, 1000);
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[600px] bg-black rounded-3xl overflow-hidden border border-white/10 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header Info */}
      <div className="absolute top-6 left-6 z-10 space-y-2 pointer-events-none">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-brand-primary/20 rounded-xl flex items-center justify-center border border-brand-primary/30 backdrop-blur-md">
            <GlobeIcon className="text-brand-primary" size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">God's Eye</h2>
            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
              Global Market Constellation Active
            </p>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 bg-gray-900/50 backdrop-blur-md border border-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {/* Globe Visualization */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Globe
          ref={globeRef}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          
          pointsData={marketHubs}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.1}
          pointRadius={0.5}
          pointsMerge={true}
          pointLabel={(d: any) => `
            <div class="bg-gray-900 border border-gray-700 p-2 rounded shadow-xl text-white">
              <b class="text-brand-primary">${d.name}</b><br/>
              <span class="text-xs text-gray-400">Click to view market details</span>
            </div>
          `}
          onPointClick={handleHubClick}
          onPointHover={setHoveredHub}

          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={4}
          arcDashAnimateTime={1500}
          arcStroke={0.5}
          
          atmosphereColor="#22c55e"
          atmosphereAltitude={0.15}
        />
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedHub && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="absolute top-0 right-0 w-full md:w-[450px] h-full bg-gray-900/80 backdrop-blur-2xl border-l border-white/10 z-20 p-8 overflow-y-auto"
          >
            <button 
              onClick={closeDetails}
              className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Global View</span>
            </button>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-white">{selectedHub.name}</h3>
                  <p className="text-brand-primary font-mono text-sm">{selectedHub.lat.toFixed(4)}° N, {selectedHub.lng.toFixed(4)}° E</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${selectedHub.details.marketStatus === 'Open' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {selectedHub.details.marketStatus}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Volatility</p>
                  <p className={`text-xl font-bold ${selectedHub.details.volatility === 'Low' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {selectedHub.details.volatility}
                  </p>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Sentiment</p>
                  <p className="text-xl font-bold text-white">{selectedHub.details.sentiment}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} className="text-brand-primary" /> Market Trends
                </h4>
                <div className="space-y-3">
                  <TrendItem label="Stocks" value={selectedHub.trends.stock} />
                  <TrendItem label="Forex" value={selectedHub.trends.forex} />
                  <TrendItem label="Commodities" value={selectedHub.trends.commodities} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-brand-secondary" /> Top Traded Assets
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedHub.details.topAssets.map((asset: string) => (
                    <span key={asset} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-mono text-white">
                      {asset}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-blue-400" /> Regional News
                </h4>
                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                  <p className="text-sm text-gray-300 leading-relaxed italic">
                    "{selectedHub.details.news}"
                  </p>
                </div>
              </div>

              <button className="w-full bg-brand-primary text-bg-dark py-4 rounded-2xl font-bold text-lg hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2">
                Open Regional Terminal <BarChart3 size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend / Info */}
      {!selectedHub && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-end gap-4 pointer-events-none"
        >
          <div className="bg-gray-900/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl max-w-xs pointer-events-auto">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-brand-primary font-bold">God's Eye Interface:</span> Click on any major financial hub to drill down into real-time market environments, trends, and regional news.
            </p>
          </div>
          
          <div className="flex gap-4 pointer-events-auto">
            <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Bullish</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Bearish</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

function TrendItem({ label, value }: { label: string, value: string }) {
  const isPositive = value.includes('+') || value.includes('Up') || value.includes('Strong') || value.includes('High');
  const isNegative = value.includes('-') || value.includes('Down') || value.includes('Weak') || value.includes('Low');

  return (
    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
      <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-bold font-mono ${isPositive ? 'text-brand-primary' : isNegative ? 'text-red-400' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}
