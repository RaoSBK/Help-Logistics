import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { requestCopilotQuery } from '../../api';
import { Bot, Send, User } from 'lucide-react';

interface Msg {
  sender: 'ai' | 'user';
  text: string;
}

export default function CopilotPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    { sender: 'ai', text: 'Hello! I am your Logistics Copilot. How can I assist with your supply chain decisions today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setLoading(true);

    try {
      const data = await requestCopilotQuery({ query: userQuery, shipmentDetails: { id: 'SHP-998', status: 'IN_TRANSIT' } });
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel flex flex-col h-[500px]">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 pb-3 border-b border-slate-700">
        <div className="bg-brand-500/20 p-1.5 rounded-lg border border-brand-500/30">
          <Bot className="text-brand-400" size={20} />
        </div>
        Logistics Copilot
      </h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-brand-900/50 flex-shrink-0 flex items-center justify-center border border-brand-500/30">
                <Bot size={16} className="text-brand-400" />
              </div>
            )}
            <div className={`px-4 py-2 text-sm max-w-[85%] rounded-2xl ${msg.sender === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center border border-slate-600">
                <User size={16} className="text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-xs text-slate-500 flex items-center gap-2"><Bot size={14} className="animate-pulse" /> Copilot is thinking...</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask for rerouting advice..." 
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-white placeholder-slate-500"
        />
        <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors disabled:opacity-50">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
