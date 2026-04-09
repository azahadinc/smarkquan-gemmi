import React, { useState, useRef, useMemo, useEffect } from 'react';
import { BarChart3, CircleDot, LayoutGrid, ShieldAlert, Settings, Activity, PieChart, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';

const getVolatilityColor = (vol: number) => {
  if (vol < 2) return '#22c55e'; // green-500
  if (vol < 4) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
};

// 3D Bubble Chart Component (Scatter Plot)
const BubbleChart3D: React.FC<{ bubbles: any[], onHover: (bubble: any) => void }> = ({ bubbles, onHover }) => {
  const points = useMemo(() => {
    return bubbles.map((bubble, i) => {
      // Position based on index for a distributed look, or could be based on metrics
      const angle = (i / bubbles.length) * Math.PI * 2;
      const radius = 3 + Math.random() * 4;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 6;
      const z = Math.sin(angle) * radius;
      
      return { ...bubble, position: [x, y, z] };
    });
  }, [bubbles]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {points.map((bubble) => {
        const size = Math.sqrt(bubble.cap) * 0.02 + 0.1;
        
        return (
          <Float key={bubble.ticker} speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh 
              position={bubble.position as any}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(bubble);
              }}
              onPointerOut={() => onHover(null)}
            >
              <sphereGeometry args={[size, 32, 32]} />
              <MeshDistortMaterial 
                color={getVolatilityColor(bubble.vol)} 
                speed={3} 
                distort={0.2} 
                radius={1} 
                emissive={getVolatilityColor(bubble.vol)}
                emissiveIntensity={0.2}
              />
              <Text
                position={[0, size + 0.3, 0]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
              >
                {bubble.ticker}
              </Text>
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

// 3D Risk Shield Component
const RiskShield3D: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[2, 0]} />
          <meshStandardMaterial 
            color="#22c55e" 
            wireframe 
            emissive="#22c55e"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

// 3D Market City (Treemap) Component
const MarketCity3D: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {data.map((item, i) => {
        const x = (i % 4) * 2 - 3;
        const z = Math.floor(i / 4) * 2 - 2;
        const height = Math.abs(item.change) * 0.5 + 0.5;
        const color = item.change >= 0 ? '#22c55e' : '#ef4444';
        
        return (
          <Float key={item.name} speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
            <mesh position={[x, height / 2, z]}>
              <boxGeometry args={[1.5, height, 1.5]} />
              <meshStandardMaterial 
                color={color} 
                transparent 
                opacity={0.8}
                emissive={color}
                emissiveIntensity={0.2}
              />
              <Text
                position={[0, height / 2 + 0.3, 0]}
                fontSize={0.2}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {item.name}
              </Text>
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

// 3D Data Stream Component
const DataStream3D: React.FC = () => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 100; i++) {
      p.push({
        position: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5],
        speed: Math.random() * 0.02 + 0.01
      });
    }
    return p;
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      {points.map((p, i) => (
        <Float key={i} speed={5} rotationIntensity={2} floatIntensity={2}>
          <mesh position={p.position as any}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// 3D Execution Pipeline Component
const ExecutionPipeline3D: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, 0, i * 1.5 - 3]}>
          <torusGeometry args={[1.5, 0.05, 16, 100]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <Float speed={5} rotationIntensity={2} floatIntensity={2}>
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
        </mesh>
      </Float>
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

export const QuantTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState('market-data');
  const [hoveredBubble, setHoveredBubble] = useState<any>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Quant Tools</h2>
      
      <div className="flex gap-2 p-1 bg-gray-900 rounded-lg w-fit">
        {[
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
        {activeTool === 'market-data' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">3D Market Data Stream</h3>
            <div className="h-[400px] bg-black rounded-xl relative overflow-hidden">
              <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <DataStream3D />
                <OrbitControls 
                  enableZoom={true} 
                  enablePan={true} 
                  enableDamping={true} 
                  dampingFactor={0.05}
                  rotateSpeed={0.5}
                />
              </Canvas>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="grid grid-cols-2 gap-4 w-full max-w-2xl px-10">
                  {[
                    { name: 'S&P 500', change: '-0.84%', color: 'text-red-500' },
                    { name: 'Communications', change: '+0.01%', color: 'text-green-500' },
                    { name: 'ICE Brent Crude', change: '-1.73%', color: 'text-red-500' },
                    { name: 'Fed Fund Rate', current: '0.13', prev: '0.12' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800 pointer-events-auto hover:border-brand-primary/50 transition-colors"
                    >
                      <p className="text-gray-400 text-sm mb-1">{item.name}</p>
                      <p className={`text-2xl font-bold ${item.color || 'text-white'}`}>
                        {item.change || `${item.current} (${item.prev})`}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTool === 'stock-bubbles' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">3D Stock Volatility Bubbles</h3>
            <div className="h-[500px] bg-black rounded-xl relative overflow-hidden">
              <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
                <BubbleChart3D 
                  bubbles={[ 
                    { ticker: 'AAPL', name: 'Apple Inc.', cap: 2800, vol: 1.2 }, 
                    { ticker: 'MSFT', name: 'Microsoft Corp.', cap: 2500, vol: 1.5 },
                    { ticker: 'GOOGL', name: 'Alphabet Inc.', cap: 1600, vol: 1.8 },
                    { ticker: 'AMZN', name: 'Amazon.com Inc.', cap: 1400, vol: 2.1 },
                    { ticker: 'NVDA', name: 'NVIDIA Corp.', cap: 1200, vol: 3.2 },
                    { ticker: 'META', name: 'Meta Platforms', cap: 800, vol: 3.5 },
                    { ticker: 'TSLA', name: 'Tesla, Inc.', cap: 700, vol: 4.5 }, 
                    { ticker: 'V', name: 'Visa Inc.', cap: 480, vol: 1.3 },
                    { ticker: 'JPM', name: 'JPMorgan Chase', cap: 450, vol: 1.1 },
                    { ticker: 'AMD', name: 'AMD', cap: 220, vol: 4.2 },
                    { ticker: 'NFLX', name: 'Netflix, Inc.', cap: 180, vol: 3.8 },
                    { ticker: 'DIS', name: 'Walt Disney Co.', cap: 160, vol: 2.5 }
                  ]} 
                  onHover={setHoveredBubble}
                />
                <OrbitControls 
                  enableZoom={true} 
                  enablePan={true} 
                  enableDamping={true} 
                  dampingFactor={0.05}
                  rotateSpeed={0.5}
                />
              </Canvas>

              {hoveredBubble && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute top-4 right-4 bg-gray-900/90 backdrop-blur-md p-4 rounded-xl border border-gray-700 text-white shadow-2xl z-20"
                >
                  <p className="font-bold text-lg text-brand-primary">{hoveredBubble.name}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-400">Ticker</span>
                      <span className="font-mono">{hoveredBubble.ticker}</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-400">Market Cap</span>
                      <span className="font-mono">${hoveredBubble.cap}B</span>
                    </div>
                    <div className="flex justify-between gap-8">
                      <span className="text-gray-400">Volatility</span>
                      <span className={`font-mono ${hoveredBubble.vol > 3 ? 'text-red-400' : 'text-green-400'}`}>
                        {hoveredBubble.vol}%
                      </span>
                    </div>
                  </div>
                </motion.div>
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
            <h3 className="text-xl font-bold text-white">3D Market City (Treemap)</h3>
            <div className="h-[500px] bg-black rounded-xl relative overflow-hidden">
              <Canvas camera={{ position: [8, 8, 8], fov: 45 }}>
                <MarketCity3D 
                  data={[
                    { name: 'BTC', change: 2.5 },
                    { name: 'ETH', change: 1.2 },
                    { name: 'SOL', change: -3.4 },
                    { name: 'ADA', change: 0.5 },
                    { name: 'DOT', change: -1.1 },
                    { name: 'DOGE', change: 5.2 },
                    { name: 'AVAX', change: -2.0 },
                    { name: 'LINK', change: 0.8 },
                    { name: 'UNI', change: -0.5 },
                    { name: 'MATIC', change: 1.5 },
                    { name: 'XRP', change: -1.8 },
                    { name: 'LTC', change: 0.2 },
                  ]}
                />
                <OrbitControls 
                  enableZoom={true} 
                  enablePan={true} 
                  enableDamping={true} 
                  dampingFactor={0.05}
                  rotateSpeed={0.5}
                  autoRotate 
                  autoRotateSpeed={0.5} 
                />
              </Canvas>
              <div className="absolute bottom-4 right-4 text-xs text-gray-500 italic">
                Height represents volatility, color represents change.
              </div>
            </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 3D Execution Visual */}
              <div className="lg:col-span-1 bg-black rounded-2xl border border-gray-800 h-[300px] relative overflow-hidden">
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                  <ExecutionPipeline3D />
                  <OrbitControls 
                    enableZoom={true} 
                    enablePan={true} 
                    enableDamping={true} 
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                  />
                </Canvas>
                <div className="absolute bottom-4 left-4">
                  <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">Execution Engine</p>
                  <p className="text-white font-bold">ULTRA-LOW LATENCY</p>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 3D Risk Visualization */}
              <div className="lg:col-span-1 bg-black rounded-2xl border border-gray-800 h-[300px] relative overflow-hidden">
                <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                  <RiskShield3D />
                  <OrbitControls 
                    enableZoom={true} 
                    enablePan={true} 
                    enableDamping={true} 
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                  />
                </Canvas>
                <div className="absolute bottom-4 left-4">
                  <p className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">System Integrity</p>
                  <p className="text-white font-bold">100.0% SECURE</p>
                </div>
              </div>

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
