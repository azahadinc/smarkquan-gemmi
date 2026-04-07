import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Simple and Secure<br />Quantitative Trading
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl">
          Tradefy's fully-autonomous trading algorithm and market capitalization strategies outperform even the best trading experts.
        </p>
        <button 
          onClick={() => navigate('/auth')}
          className="bg-brand-primary text-bg-dark px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 hover:bg-brand-primary/90 transition-all"
        >
          Get Started <ArrowRight size={20} />
        </button>
      </section>

      {/* Stats Section */}
      <section className="bg-[#1a1d23] py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { icon: BarChart3, label: 'Performance', value: '12.5% Avg' },
            { icon: ShieldCheck, label: 'Security', value: 'Bank-Grade' },
            { icon: Zap, label: 'Execution', value: '< 10ms' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <stat.icon size={48} className="text-brand-primary" />
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
