import RiskPanel from '../features/disruption-risk/RiskPanel';
import RoutingPanel from '../features/alternate-routing/RoutingPanel';
import EtaPanel from '../features/eta-prediction/EtaPanel';
import CongestionPanel from '../features/bottleneck-detection/CongestionPanel';
import CopilotPanel from '../features/logistics-copilot/CopilotPanel';
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

        {/* Middle Column: Map & Routing */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel h-64 flex flex-col items-center justify-center relative overflow-hidden border-dashed bg-slate-900 border-slate-700">
            {/* Map Placeholder */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#0ea5e9 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            <Network size={48} className="text-slate-600 mb-4 z-10" />
            <p className="text-slate-500 font-medium z-10">Interactive Route Visualization Map</p>
            <p className="text-xs text-slate-600 mt-2 z-10">(MapBox/Leaflet Integration Point)</p>
          </div>
          <RoutingPanel />
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
