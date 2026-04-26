import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { requestAlternateRoute } from '../../api';
import { Map, ArrowRight, Zap, AlertTriangle, Sparkles } from 'lucide-react';

const nodeOptions = [
  { value: 'A', label: 'Origin Facility' },
  { value: 'B', label: 'Highway Checkpoint 1' },
  { value: 'C', label: 'Mountain Pass' },
  { value: 'D', label: 'Destination Port' },
  { value: 'E', label: 'Valley Route' },
];

export default function RoutingPanel() {
  const { alternateRoute, setAlternateRoute } = useStore();
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState('A');
  const [end, setEnd] = useState('D');
  const [disruptionType, setDisruptionType] = useState('none');
  const [routePreference, setRoutePreference] = useState('fastest');

  const findRoute = async () => {
    setLoading(true);
    try {
      const disruption = disruptionType === 'none' ? null : disruptionType === 'closure_ab'
        ? { fromNode: 'A', toNode: 'B', severityMultiplier: Infinity }
        : disruptionType === 'traffic_bc'
        ? { fromNode: 'B', toNode: 'C', severityMultiplier: 1.6 }
        : disruptionType === 'storm_ce'
        ? { fromNode: 'C', toNode: 'E', severityMultiplier: 1.4 }
        : null;

      const payload = {
        start,
        end,
        disruption,
        routePreference,
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
              <select value={start} onChange={(e) => setStart(e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none">
                {nodeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label} ({option.value})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase">Destination</label>
              <select value={end} onChange={(e) => setEnd(e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none">
                {nodeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label} ({option.value})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase">Disruption Type</label>
              <select value={disruptionType} onChange={(e) => setDisruptionType(e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none">
                <option value="none">No disruption (live traffic only)</option>
                <option value="closure_ab">Accident / closure (A → B)</option>
                <option value="traffic_bc">Weather congestion (B → C)</option>
                <option value="storm_ce">Storm diversion (C → E)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1 uppercase">Route Preference</label>
              <select value={routePreference} onChange={(e) => setRoutePreference(e.target.value)} className="w-full bg-white border border-slate-200 rounded p-2 focus:ring-1 focus:ring-blue-500 outline-none">
                <option value="fastest">Fastest route</option>
                <option value="safest">Safest route</option>
              </select>
            </div>
          </div>
          
          <div className="text-[10px] text-slate-500 leading-snug">
            <p><strong>Tip:</strong> Keep the start and end points the same to compare the original route with the optimized suggestion.</p>
            <p className="mt-1">The route suggestion uses live network conditions to reduce delays or avoid blocked roads.</p>
          </div>
          <button onClick={findRoute} disabled={loading} className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
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
            <div className="flex flex-wrap gap-2 items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">Optimized AI Route (A*)</p>
                <p className="text-[12px] text-slate-700">Preference: {alternateRoute.routePreference || 'fastest'}</p>
                <p className="text-[12px] text-slate-700">Score: {alternateRoute.metrics?.routeScore ?? 'N/A'}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">ETA delta</p>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{alternateRoute.metrics?.delta}</span>
              </div>
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
              <p className="text-[10px] text-blue-600 font-semibold mb-2 uppercase tracking-wider">Live Network Insight</p>
              <p className="text-xs text-slate-700 leading-relaxed">
                {alternateRoute.liveStatus?.message || 'Route calculated using the latest available network conditions.'}
              </p>
            </div>
            {alternateRoute.routeSegments?.length > 0 && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-500 font-semibold mb-2 uppercase tracking-wider">Route Segments</p>
                <div className="space-y-2">
                  {alternateRoute.routeSegments.map((segment: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-[11px] text-slate-700">
                      <span>{segment.from} → {segment.to}</span>
                      <span>{segment.time}m · {segment.risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setAlternateRoute(null)} className="w-full mt-auto bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-sm font-semibold py-2 rounded-lg transition-colors shadow-sm">
            Reset Demo
          </button>
        </div>
      )}
    </div>
  );
}
