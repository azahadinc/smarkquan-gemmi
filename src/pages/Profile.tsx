import React from 'react';
import { User } from 'lucide-react';

export const Profile: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">User Profile</h2>
      <div className="glass-card flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
          <User size={40} className="text-gray-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">John Doe</h3>
          <p className="text-gray-400">azahadinc@gmail.com</p>
          <p className="text-sm text-brand-primary">Pro Subscription</p>
        </div>
      </div>
    </div>
  );
};
