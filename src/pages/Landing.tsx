import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1115] text-white relative overflow-hidden">
      {/* Background Image with Overlays */}
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center scale-110"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832")',
          filter: 'blur(4px)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0f1115] via-transparent to-[#0f1115]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0f1115_70%)]" />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-32 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold mb-8 animate-pulse">
          <Zap size={14} />
          <span>NEW: AI-DRIVEN PORTFOLIO OPTIMIZATION</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent tracking-tight">
          Simple and Secure<br />Quantitative Trading
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          Tradefy's fully-autonomous trading algorithm and market capitalization strategies outperform even the best trading experts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => navigate('/auth')}
            className="bg-brand-primary text-bg-dark px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
          >
            Get Started <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
          >
            View Demo
          </button>
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
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Trusted by Traders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#1a1d23] p-8 rounded-3xl border border-gray-800 flex gap-6">
              <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" className="w-20 h-20 rounded-full" referrerPolicy="no-referrer" />
              <div>
                <p className="text-lg italic mb-4">"Tradefy has completely revolutionized my trading strategy. The automation is seamless and the results are consistent."</p>
                <p className="font-bold text-brand-primary">- Trader {i}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
