import React, { useState } from 'react';
import { Shield, Key, Bell, Save, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export const Settings: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestStatus('idle');
    // Simulate API connection test
    setTimeout(() => {
      setIsTesting(false);
      setTestStatus('success');
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white tracking-tight">Settings</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
          <Shield size={14} className="text-brand-primary" />
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">Security: High</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Navigation (Visual Only) */}
        <div className="space-y-1">
          {['General', 'Exchange API', 'Notifications', 'Security', 'Billing'].map((item) => (
            <button
              key={item}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                item === 'Exchange API' ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Exchange API Section */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Key className="text-brand-primary" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Binance API Configuration</h3>
                <p className="text-xs text-gray-500">Connect your Binance account for automated trading.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  API Key
                  <span className="text-[10px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded uppercase">Required</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter your Binance API Key" 
                  className="w-full bg-black/40 border border-gray-800 focus:border-brand-primary/50 rounded-xl p-3 text-white text-sm transition-all outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  Secret Key
                  <span className="text-[10px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded uppercase">Required</span>
                </label>
                <input 
                  type="password" 
                  placeholder="Enter your Binance Secret Key" 
                  className="w-full bg-black/40 border border-gray-800 focus:border-brand-primary/50 rounded-xl p-3 text-white text-sm transition-all outline-none" 
                />
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button 
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isTesting ? 'animate-spin' : ''} />
                  {isTesting ? 'Testing Connection...' : 'Test Connection'}
                </button>
                
                {testStatus === 'success' && (
                  <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium animate-in fade-in slide-in-from-left-2">
                    <CheckCircle2 size={14} />
                    Connection Successful
                  </div>
                )}
                {testStatus === 'error' && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium animate-in fade-in slide-in-from-left-2">
                    <AlertCircle size={14} />
                    Connection Failed
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <p className="text-[11px] text-blue-400 leading-relaxed">
                <span className="font-bold uppercase mr-1">Security Note:</span> 
                Ensure your API key has "Enable Spot & Margin Trading" permissions but "Enable Withdrawals" is <strong>DISABLED</strong> for maximum security.
              </p>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Bell className="text-blue-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Notification Preferences</h3>
                <p className="text-xs text-gray-500">Stay updated on your bot's performance.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">Telegram Alerts</p>
                  <p className="text-[10px] text-gray-500">Receive trade execution notifications via Telegram.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-brand-primary focus:ring-brand-primary" />
              </div>

              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-white">Email Reports</p>
                  <p className="text-[10px] text-gray-500">Daily summary of portfolio performance.</p>
                </div>
                <input type="checkbox" className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-brand-primary focus:ring-brand-primary" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button className="flex items-center gap-2 bg-brand-primary text-bg-dark px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
