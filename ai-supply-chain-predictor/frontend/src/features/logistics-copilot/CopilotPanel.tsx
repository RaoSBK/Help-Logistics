import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { requestCopilotQuery } from '../../api';
import { Bot, Send, User } from 'lucide-react';
import RouteRecommendationWidget from './widgets/RouteRecommendationWidget';
import RiskAssessmentWidget from './widgets/RiskAssessmentWidget';

interface Msg {
  sender: 'ai' | 'user';
  text: string;
  component?: string | null;
  payload?: any;
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
      // Using 'SHP-123' to test the HIGH risk disruption scenario from our backend mock
      const data = await requestCopilotQuery({ query: userQuery, shipmentDetails: { id: 'SHP-123', status: 'IN_TRANSIT' } });
      
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: data.textResponse || data.response || 'Action completed.',
        component: data.uiComponent,
        payload: data.uiPayload
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  const renderWidget = (component?: string | null, payload?: any) => {
    if (!component || !payload) return null;
    switch (component) {
      case 'RouteRecommendationWidget':
        return <RouteRecommendationWidget data={payload} />;
      case 'RiskAssessmentWidget':
        return <RiskAssessmentWidget data={payload} />;
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel flex flex-col h-full min-h-[500px]">
      <h2 className="text-sm font-bold mb-4 flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-600">
        <div className="bg-blue-50 dark:bg-blue-500/15 p-1.5 rounded-lg border border-blue-200 dark:border-blue-500/30">
          <Bot className="text-blue-500" size={16} />
        </div>
        Logistics Copilot
      </h2>
      
      <div className="flex-1 mb-4 space-y-4 pr-2">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-500/15 flex-shrink-0 flex items-center justify-center border border-blue-200 dark:border-blue-500/30">
                <Bot size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
            )}
            
            <div className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2.5 text-[13px] leading-relaxed rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-bl-none border border-slate-200 dark:border-slate-600'}`}>
                {msg.text}
              </div>
              
              {msg.sender === 'ai' && msg.component && (
                <div className="mt-1 w-full flex justify-start">
                  {renderWidget(msg.component, msg.payload)}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-600 shadow-sm">
                <User size={16} className="text-slate-500 dark:text-slate-400" />
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium"><Bot size={14} className="animate-pulse text-blue-500" /> Copilot is thinking...</div>}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative mt-auto">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask for rerouting advice..." 
          className="w-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
        <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
