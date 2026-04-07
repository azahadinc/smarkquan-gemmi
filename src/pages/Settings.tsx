import React from 'react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>
      <div className="glass-card space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">API Key (Binance)</label>
          <input type="password" placeholder="Enter API Key" className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Notifications</label>
          <div className="flex items-center gap-2 text-white">
            <input type="checkbox" defaultChecked /> Enable Telegram alerts
          </div>
        </div>
        <button className="bg-brand-primary text-bg-dark px-4 py-2 rounded font-bold">Save Settings</button>
      </div>
    </div>
  );
};
