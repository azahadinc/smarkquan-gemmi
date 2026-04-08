import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Zap, TrendingUp, Globe, Cpu, Lock } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white relative overflow-hidden selection:bg-brand-primary selection:text-bg-dark">
      {/* Background Image with Overlays */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832")',
          filter: 'blur(4px)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0f1115] via-transparent to-[#0f1115]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f1115_70%)]" />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5
            }}
            animate={{ 
              y: [null, (Math.random() * -100 - 50) + "px"],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-1 h-1 bg-brand-primary rounded-full blur-[1px]"
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold mb-8"
        >
          <Zap size={14} className="animate-pulse" />
          <span>NEW: AI-DRIVEN PORTFOLIO OPTIMIZATION</span>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-8xl font-bold mb-6 bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tighter leading-[1.1] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          The Future of<br />Quant Trading
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
        >
          Tradefy's fully-autonomous trading algorithm and market capitalization strategies outperform even the best trading experts.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <button 
            onClick={() => navigate('/auth')}
            className="bg-brand-primary text-bg-dark px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-[0_0_40px_rgba(34,197,94,0.2)] hover:scale-105 active:scale-95"
          >
            Get Started <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
          >
            View Demo
          </button>
        </motion.div>

        {/* 3D Dashboard Preview */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full max-w-5xl perspective-1000 py-20"
        >
          <motion.div
            style={{ 
              rotateX, 
              rotateY,
              transformStyle: "preserve-3d"
            }}
            initial={{ rotateX: 45, rotateY: -10, y: 100, opacity: 0 }}
            animate={{ rotateX: 20, rotateY: -5, y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
            className="relative"
          >
            <div className="bg-[#1a1d23] rounded-3xl border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="h-8 bg-gray-800/50 border-b border-white/5 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <img 
                src="https://images.unsplash.com/photo-1611974714658-058e117b8117?auto=format&fit=crop&q=80&w=2000" 
                alt="Dashboard Preview" 
                className="w-full opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating Elements with Parallax */}
            <motion.div
              style={{ translateZ: 100, transformStyle: "preserve-3d" }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-brand-primary/20 backdrop-blur-xl border border-brand-primary/30 p-6 rounded-2xl shadow-2xl hidden lg:block"
            >
              <div style={{ transform: "translateZ(20px)" }}>
                <TrendingUp className="text-brand-primary mb-2" size={32} />
                <div className="text-2xl font-bold text-white">+12.5%</div>
                <div className="text-xs text-brand-primary font-bold">DAILY PERFORMANCE</div>
              </div>
            </motion.div>

            <motion.div
              style={{ translateZ: 150, transformStyle: "preserve-3d" }}
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 p-6 rounded-2xl shadow-2xl hidden lg:block"
            >
              <div style={{ transform: "translateZ(30px)" }}>
                <ShieldCheck className="text-blue-400 mb-2" size={32} />
                <div className="text-2xl font-bold text-white">SECURE</div>
                <div className="text-xs text-blue-400 font-bold">AES-256 ENCRYPTED</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-32 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Engineered for Excellence</h2>
          <p className="text-gray-400">Professional tools for the modern quantitative trader.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Cpu, title: 'AI Engine', desc: 'Neural networks optimized for high-frequency patterns.' },
            { icon: Globe, title: 'Global Reach', desc: 'Trade across 50+ exchanges with a single API.' },
            { icon: Lock, title: 'Non-Custodial', desc: 'Your keys, your crypto. We never touch your funds.' },
            { icon: BarChart3, title: 'Deep Analytics', desc: 'Institutional-grade backtesting and risk metrics.' },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-[#1a1d23]/50 backdrop-blur-md border border-white/5 p-8 rounded-3xl hover:border-brand-primary/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-brand-primary/10 transition-colors">
                <feature.icon size={28} className="text-gray-400 group-hover:text-brand-primary transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1a1d23]/50 backdrop-blur-md border-y border-white/5 py-20 relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: BarChart3, label: 'Performance', value: '12.5% Avg' },
            { icon: ShieldCheck, label: 'Security', value: 'Bank-Grade' },
            { icon: Zap, label: 'Execution', value: '< 10ms' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon size={32} className="text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-32">
        <h2 className="text-4xl font-bold text-center mb-20">Trusted by the Best</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#1a1d23] p-10 rounded-[40px] border border-gray-800 flex flex-col md:flex-row gap-8 items-center md:items-start">
              <img src={`https://picsum.photos/seed/user${i}/150/150`} alt="User" className="w-24 h-24 rounded-3xl object-cover grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Zap key={j} size={16} className="text-brand-primary fill-brand-primary" />)}
                </div>
                <p className="text-xl italic mb-6 text-gray-300 leading-relaxed">"Tradefy has completely revolutionized my trading strategy. The automation is seamless and the results are consistent."</p>
                <p className="font-bold text-white text-lg">Alex Thompson</p>
                <p className="text-brand-primary text-sm font-bold uppercase tracking-widest">Hedge Fund Manager</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-32 text-center">
        <div className="bg-gradient-to-br from-brand-primary/20 to-blue-500/20 border border-white/10 rounded-[50px] p-20 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.1),transparent)]" />
          <h2 className="text-5xl font-bold mb-8 relative z-10">Ready to automate your wealth?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto relative z-10">Join 10,000+ traders who have already switched to institutional-grade automation.</p>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-white text-bg-dark px-12 py-6 rounded-2xl font-bold text-xl hover:bg-gray-200 transition-all relative z-10 hover:scale-105 active:scale-95"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-primary rounded flex items-center justify-center">
            <span className="text-bg-dark font-bold text-xs">↑</span>
          </div>
          <span className="text-white font-bold">Tradefy.ai</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">API Docs</a>
        </div>
        <div>© 2026 Tradefy Technologies Inc.</div>
      </footer>
    </div>
  );
};
