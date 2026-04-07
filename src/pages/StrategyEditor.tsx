import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Save, ArrowLeft, Play, FileText, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StrategyEditor: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('New Strategy');
  const [script, setScript] = useState(`# Python Strategy Script
def strategy(data):
    # Your logic here
    return "BUY"
`);
  const [showPopup, setShowPopup] = useState(false);

  const saveScript = () => {
    if (!name.trim()) {
      alert('Please enter a strategy name.');
      return;
    }
    // In a real app, save the script to the backend
    console.log('Saving strategy:', name, script);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/strategies');
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col space-y-2 p-2">
      <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-800">
        <button onClick={() => navigate('/strategies')} className="flex items-center gap-2 text-gray-400 hover:text-white">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-2">
          <FileText className="text-brand-primary" size={20} />
          <input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent text-lg font-bold text-white focus:outline-none border-b border-transparent focus:border-brand-primary"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => console.log('Run')} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-700">
            <Play size={16} /> Run
          </button>
          <button onClick={saveScript} className="flex items-center gap-2 bg-brand-primary text-bg-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-primary/90">
            <Save size={16} /> Save
          </button>
        </div>
      </div>
      
      <div className="flex-1 bg-black rounded-lg p-2 font-mono text-sm text-green-400 border border-gray-800 overflow-hidden shadow-inner">
        <textarea 
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="w-full h-full bg-transparent resize-none focus:outline-none"
          spellCheck="false"
        />
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <div className="glass-card p-8 flex flex-col items-center gap-4">
              <CheckCircle2 size={48} className="text-brand-primary" />
              <h2 className="text-2xl font-bold text-white">Strategy Saved!</h2>
              <p className="text-xl text-brand-primary font-mono">{name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
