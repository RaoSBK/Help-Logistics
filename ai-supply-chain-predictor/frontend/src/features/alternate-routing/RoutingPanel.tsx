import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { requestAlternateRoute } from '../../api';
import { Map, ArrowRight, Zap, AlertTriangle, Sparkles } from 'lucide-react';

export default function RoutingPanel() {
  const { alternateRoute, setAlternateRoute } = useStore();
  const [loading, setLoading] = useState(false);

  const findRoute = async () => {
    setLoading(true);
    try {
      // Send a simulated disruption: e.g. close the fastest path A -> B
      const payload = {
        start: 'A',
        end: 'D',
        disruption: { fromNode: 'A', toNode: 'B', severityMultiplier: Infinity }
      };
      const data = await requestAlternateRoute(payload);
      setAlternateRoute(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Map className="text-brand-400" />
        Smart Routing Optimization
      </h2>

      {!alternateRoute ? (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Source</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white">
                <option value="A">Origin (A)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Destination</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white">
                <option value="D">Destination Port (D)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Disruption Type</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white">
                <option value="closure">Accident (Closure A → B)</option>
                <option value="traffic">Weather (Severe Congestion)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Route Preference</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white">
                <option value="fastest">Fastest</option>
                <option value="safest">Safest</option>
              </select>
            </div>
          </div>
          
          <button onClick={findRoute} disabled={loading} className="w-full mt-4 bg-blue-600/80 hover:bg-blue-500 border border-blue-500 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
            {loading ? <Zap className="animate-spin text-white" size={18} /> : 
            <><AlertTriangle size={18} className="text-white" /> Generate Alternate Route</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-xs text-red-400 font-semibold mb-1 uppercase tracking-wider">Original Route (Blocked)</p>
            <div className="flex items-center gap-2 text-slate-300 flex-wrap">
              {alternateRoute.originalRoute.map((node: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold border border-slate-600">{node}</div>
                  {i < alternateRoute.originalRoute.length - 1 && <ArrowRight size={14} className="text-slate-600" />}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
               <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider">Optimized AI Route (A*)</p>
               <span className="text-xs bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-medium">{alternateRoute.metrics?.delta} ETA Cost</span>
            </div>
            <div className="flex items-center gap-2 text-white mt-2 flex-wrap">
              {alternateRoute.alternateRoute.map((node: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-brand-500/20 border border-brand-400">{node}</div>
                  {i < alternateRoute.alternateRoute.length - 1 && <ArrowRight size={14} className="text-brand-400" />}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-xs text-brand-400 font-semibold mb-2 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={12} /> Gemini AI Insight
              </p>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{alternateRoute.aiExplanation}"
              </p>
            </div>
          </div>
          <button onClick={() => setAlternateRoute(null)} className="w-full mt-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2 rounded-lg transition-colors">
            Reset Demo
          </button>
        </div>
      )}
    </div>
  );
}
