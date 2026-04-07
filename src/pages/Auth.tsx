import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4">
      <div className="bg-[#1a1d23] rounded-3xl w-full max-w-4xl flex overflow-hidden shadow-2xl border border-gray-800">
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
        <div className="hidden md:flex w-1/2 bg-[#0f1115] items-center justify-center p-12">
          <div className="text-center">
            <div className="w-48 h-48 bg-gradient-to-br from-brand-primary to-green-800 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <span className="text-white text-6xl">↑</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Make Money Fast</h3>
            <p className="text-gray-400">Trade smart with Tradefy.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
};
