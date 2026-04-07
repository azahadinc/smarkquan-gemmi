import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Brain, LayoutDashboard, Settings as SettingsIcon, History, Bell, Search, User, Zap, Bot } from 'lucide-react';
import { cn } from '../lib/utils';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-dark flex">
      <aside className="w-16 lg:w-64 border-r border-border-subtle flex flex-col items-center lg:items-start p-4 gap-8 bg-bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,255,157,0.3)]">
            <Brain className="text-bg-dark" size={24} />
          </div>
          <h1 className="hidden lg:block text-xl font-bold tracking-tighter text-white">
            Smark<span className="text-brand-primary">Quant</span>
          </h1>
        </div>

        <nav className="flex-1 w-full space-y-2">
          <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
          <NavItem icon={History} label="Trade History" to="/history" />
          <NavItem icon={Brain} label="Strategies" to="/strategies" />
          <NavItem icon={Zap} label="Live Performance" to="/live-performance" />
          <NavItem icon={Bot} label="Bots" to="/bots" />
          <NavItem icon={SettingsIcon} label="Quant Tools" to="/quanttools" />
          <NavItem icon={SettingsIcon} label="Settings" to="/settings" />
        </nav>

        <div className="w-full pt-4 border-t border-border-subtle space-y-4">
          <NavItem icon={User} label="Profile" to="/profile" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border-subtle flex items-center justify-between px-8 bg-bg-card/30 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search assets, strategies, or orders..." 
                className="w-full bg-gray-800/50 border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-danger rounded-full border-2 border-bg-dark" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

function NavItem({ icon: Icon, label, to }: { icon: any, label: string, to: string }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={cn(
      "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
      active ? "bg-brand-primary/10 text-brand-primary" : "text-gray-500 hover:text-gray-200 hover:bg-gray-800/50"
    )}>
      <Icon size={20} className={cn("shrink-0", active ? "text-brand-primary" : "group-hover:text-brand-primary transition-colors")} />
      <span className="hidden lg:block text-sm font-medium">{label}</span>
      {active && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(0,255,157,0.8)]" />}
    </Link>
  );
}
