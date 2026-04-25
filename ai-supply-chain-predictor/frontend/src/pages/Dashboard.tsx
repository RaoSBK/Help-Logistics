import RiskPanel from '../features/disruption-risk/RiskPanel';
import EtaPanel from '../features/eta-prediction/EtaPanel';
import CongestionPanel from '../features/bottleneck-detection/CongestionPanel';
import CopilotPanel from '../features/logistics-copilot/CopilotPanel';
import LiveRouteDashboard from '../features/live-routing/LiveRouteDashboard';
import { Network } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white p-6 pb-20 font-sans relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between border-b border-slate-800 pb-6 relative z-10">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-purple-400 flex items-center gap-3">
            <Network className="text-brand-400" size={32} />
            Supply Chain Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Real-time disruption prediction & automated optimization</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          System Live
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Metrics & Risk */}
        <div className="lg:col-span-4 space-y-6">
          <RiskPanel />
          <EtaPanel />
        </div>

        {/* Middle Column: Live Routing & Congestion */}
        <div className="lg:col-span-5 space-y-6">
          <LiveRouteDashboard />
          <CongestionPanel />
        </div>

        {/* Right Column: AI Copilot */}
        <div className="lg:col-span-3">
          <CopilotPanel />
        </div>

      </main>
    </div>
  );
}
