import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Save, ArrowLeft, Play, FileText, CheckCircle2, Sparkles, Send, Loader2, MessageSquare, Code, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const JESSE_TEMPLATE = `# Tradefy Strategy (Jesse-inspired)
from tradefy.strategy import Strategy
import tradefy.indicators as ta
import tradefy.utils as utils

class MyStrategy(Strategy):
    def should_long(self) -> bool:
        # Define entry logic here
        # Example: 8 EMA crosses above 21 EMA
        short_ema = ta.ema(self.candles, 8)
        long_ema = ta.ema(self.candles, 21)
        return short_ema > long_ema

    def go_long(self):
        # Define order sizing and execution
        entry_price = self.price
        qty = utils.size_to_qty(self.balance * 0.1, entry_price)
        
        self.buy = qty, entry_price
        self.take_profit = qty, entry_price * 1.1
        self.stop_loss = qty, entry_price * 0.95

    def should_short(self) -> bool:
        return False

    def go_short(self):
        pass

    def should_cancel(self) -> bool:
        return False
`;

export const StrategyEditor: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('New Strategy');
  const [script, setScript] = useState(JESSE_TEMPLATE);
  const [showPopup, setShowPopup] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAiChat = async () => {
    if (!chatInput.trim() || isAiLoading) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are TradefyGPT, an expert quantitative developer specializing in Jesse-style trading strategies. 
            The user wants to: ${userMsg}
            
            Current script context:
            \`\`\`python
            ${script}
            \`\`\`
            
            Provide a helpful explanation and the updated Python code. 
            Format the code clearly in a markdown block. 
            Use the Jesse strategy structure (should_long, go_long, should_short, go_short).` }]
          }
        ],
        config: {
          systemInstruction: "You are TradefyGPT, a specialized AI for algorithmic trading strategy development. You write high-quality Python code using the Jesse framework syntax. You are concise, professional, and focus on risk management."
        }
      });

      const aiText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
      
      // Extract code if present
      const codeMatch = aiText.match(/```python\n([\s\S]*?)```/);
      if (codeMatch && codeMatch[1]) {
        // Optionally offer to apply the code
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error: Failed to connect to TradefyGPT. Please try again." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiCode = (code: string) => {
    setScript(code);
    setIsAiOpen(false);
  };

  const saveScript = () => {
    if (!name.trim()) return;
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate('/strategies');
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col space-y-2 p-2 relative">
      <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-800">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/strategies')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="text-brand-primary" size={20} />
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent text-lg font-bold text-white focus:outline-none border-b border-transparent focus:border-brand-primary min-w-[200px]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${isAiOpen ? 'bg-brand-primary text-bg-dark' : 'bg-gray-800 text-brand-primary border border-brand-primary/20 hover:bg-gray-700'}`}
          >
            <Sparkles size={16} /> TradefyGPT
          </button>
          <button onClick={() => console.log('Run')} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-700">
            <Play size={16} /> Run
          </button>
          <button onClick={saveScript} className="flex items-center gap-2 bg-brand-primary text-bg-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-brand-primary/90">
            <Save size={16} /> Save
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex gap-2 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 bg-black rounded-lg p-4 font-mono text-base text-green-400 border border-gray-800 overflow-hidden shadow-inner flex flex-col">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2 uppercase tracking-widest border-b border-gray-900 pb-2">
            <Code size={12} /> strategy.py
          </div>
          <textarea 
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full h-full bg-transparent resize-none focus:outline-none p-2 leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* AI Side Panel */}
        <AnimatePresence>
          {isAiOpen && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-96 bg-gray-900 rounded-lg border border-gray-800 flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-brand-primary" size={18} />
                  <span className="font-bold text-white">TradefyGPT</span>
                </div>
                <button onClick={() => setIsAiOpen(false)} className="text-gray-500 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
                {messages.length === 0 && (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <MessageSquare className="text-brand-primary" size={32} />
                    </div>
                    <p className="text-gray-400 text-sm px-6">
                      Ask me to write a strategy, add indicators, or optimize your risk management.
                    </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-brand-primary text-bg-dark font-medium rounded-tr-none' 
                        : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                    }`}>
                      <div className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </div>
                      {msg.role === 'ai' && msg.content.includes('```python') && (
                        <button 
                          onClick={() => {
                            const code = msg.content.match(/```python\n([\s\S]*?)```/)?.[1];
                            if (code) applyAiCode(code);
                          }}
                          className="mt-3 w-full py-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-lg font-bold text-xs hover:bg-brand-primary/20 transition-all"
                        >
                          Apply Code to Editor
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-brand-primary" />
                      <span className="text-xs text-gray-400">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                <div className="relative">
                  <input 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
                    placeholder="Ask TradefyGPT..."
                    className="w-full bg-black/40 border border-gray-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-brand-primary transition-all"
                  />
                  <button 
                    onClick={handleAiChat}
                    disabled={!chatInput.trim() || isAiLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-gray-900 border border-brand-primary p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl"
            >
              <CheckCircle2 size={64} className="text-brand-primary" />
              <h2 className="text-3xl font-bold text-white">Strategy Saved!</h2>
              <p className="text-2xl text-brand-primary font-mono bg-brand-primary/10 px-4 py-2 rounded-lg">{name}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
