import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832")',
          filter: 'blur(1px)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f1115] via-transparent to-[#0f1115] opacity-80" />
      
      <div className="bg-[#1a1d23]/80 backdrop-blur-2xl rounded-3xl w-full max-w-4xl flex overflow-hidden shadow-2xl border border-gray-800 relative z-10">
        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <span className="text-bg-dark font-bold">↑</span>
            </div>
            <span className="text-white font-bold text-xl">Tradefy</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="text-gray-400 mb-8">
            {isLogin ? 'Enter your credentials to access your account.' : 'Start trading in less than a minute.'}
          </p>

          <div className="flex bg-[#0f1115] p-1 rounded-xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${isLogin ? 'bg-brand-primary text-bg-dark' : 'text-gray-400'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${!isLogin ? 'bg-brand-primary text-bg-dark' : 'text-gray-400'}`}
            >
              SignUp
            </button>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            {!isLogin && (
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <User className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input placeholder="First Name" className="w-full bg-[#0f1115] p-3 pl-10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                </div>
                <div className="relative flex-1">
                  <User className="absolute left-3 top-3 text-gray-500" size={18} />
                  <input placeholder="Last Name" className="w-full bg-[#0f1115] p-3 pl-10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                </div>
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={18} />
              <input type="email" placeholder="Email Address" className="w-full bg-[#0f1115] p-3 pl-10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={18} />
              <input type="password" placeholder="Password" className="w-full bg-[#0f1115] p-3 pl-10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" />
            </div>
            
            <button className="w-full bg-brand-primary text-bg-dark py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all">
              {isLogin ? 'Login' : 'Continue'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center text-gray-500 text-sm">Or continue with</div>
          <div className="flex justify-center gap-4 mt-4">
            {['Facebook', 'Apple', 'Google'].map(provider => (
              <button key={provider} className="bg-[#0f1115] p-3 rounded-xl text-gray-400 hover:text-white transition-colors">
                {provider}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Side */}
        <div className="hidden md:flex w-1/2 relative items-center justify-center p-12 overflow-hidden">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent to-[#0f1115] opacity-60 z-10" />
          
          <div className="text-center relative z-20">
            <div className="w-48 h-48 bg-brand-primary/20 backdrop-blur-md border border-brand-primary/30 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <span className="text-brand-primary text-6xl font-bold">↑</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Quant Trading</h3>
            <p className="text-gray-300">Master the markets with Tradefy.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
};
