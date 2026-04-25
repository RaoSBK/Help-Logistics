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
    <div className="glass-panel h-full flex flex-col">
      <h2 className="text-sm font-bold flex items-center gap-2 mb-4 text-slate-900">
        <Map className="text-blue-500" size={16} />
        Smart Routing Optimization
      </h2>

      {!alternateRoute ? (
        <div className="py-2 space-y-4 flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-3 text-[10px] text-slate-900">
            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase">Source</label>
              <select className="w-full bg-white border border-slate-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none">
                <option value="A">Origin (A)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase">Destination</label>
              <select className="w-full bg-white border border-slate-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none">
                <option value="D">Destination Port (D)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase">Disruption Type</label>
              <select className="w-full bg-white border border-slate-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none">
                <option value="closure">Accident (Closure A → B)</option>
                <option value="traffic">Weather (Severe Congestion)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase">Route Preference</label>
              <select className="w-full bg-white border border-slate-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none">
                <option value="fastest">Fastest</option>
                <option value="safest">Safest</option>
              </select>
            </div>
          </div>
          
          <button onClick={findRoute} disabled={loading} className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
            {loading ? <Zap className="animate-spin text-white" size={16} /> : 
            <><AlertTriangle size={16} className="text-white" /> Generate Alternate Route</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-[10px] text-red-600 font-semibold mb-1 uppercase tracking-wider">Original Route (Blocked)</p>
            <div className="flex items-center gap-2 text-slate-700 flex-wrap">
              {alternateRoute.originalRoute.map((node: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold border border-slate-200">{node}</div>
                  {i < alternateRoute.originalRoute.length - 1 && <ArrowRight size={12} className="text-slate-400" />}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
               <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">Optimized AI Route (A*)</p>
               <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{alternateRoute.metrics?.delta} ETA Cost</span>
            </div>
            <div className="flex items-center gap-2 text-white mt-2 flex-wrap">
              {alternateRoute.alternateRoute.map((node: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shadow-sm">{node}</div>
                  {i < alternateRoute.alternateRoute.length - 1 && <ArrowRight size={12} className="text-blue-400" />}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
              <p className="text-[10px] text-blue-600 font-semibold mb-2 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={10} /> Gemini AI Insight
              </p>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{alternateRoute.aiExplanation}"
              </p>
            </div>
          </div>
          <button onClick={() => setAlternateRoute(null)} className="w-full mt-auto bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold py-2 rounded-lg transition-colors shadow-sm">
            Reset Demo
          </button>
        </div>
      )}
    </div>
  );
}
