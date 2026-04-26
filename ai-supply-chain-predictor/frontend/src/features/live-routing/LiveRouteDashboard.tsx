import { useLiveRoute } from './useLiveRoute';
import RouteVisualizer from './RouteVisualizer';
import { Play, Square, Activity, AlertTriangle, Route, ShieldAlert } from 'lucide-react';
import { requestRiskScore } from '../../api';
import { useState, useEffect } from 'react';

export default function LiveRouteDashboard() {
  const { isConnected, isSimulating, routeData, startSimulation, stopSimulation } = useLiveRoute();
  const [riskData, setRiskData] = useState<any>(null);

  // Fetch risk data whenever route changes
  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const route = routeData?.alternateRoute?.join('-') || routeData?.originalRoute?.join('-') || 'A-D';
        const data = await requestRiskScore({ route });
        setRiskData(data);
      } catch (e) {
        console.error('Failed to fetch risk data:', e);
      }
    };
    
    if (routeData) {
      fetchRisk();
    }
  }, [routeData]);

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-amber-400';
      case 'Low': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch(level) {
      case 'High': return 'bg-red-500/10 border-red-500/30';
      case 'Medium': return 'bg-amber-500/10 border-amber-500/30';
      case 'Low': return 'bg-emerald-500/10 border-emerald-500/30';
      default: return 'bg-slate-800/50 border-slate-700/50';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel relative overflow-hidden border-brand-500/20 shadow-lg shadow-brand-500/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="text-brand-400" />
            Live Network Monitor
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium bg-slate-800/80 px-2 py-1 rounded-full border border-slate-700">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span className="hidden sm:inline">{isConnected ? 'Socket Connected' : 'Disconnected'}</span>
            </div>
            {isSimulating ? (
              <button onClick={stopSimulation} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors cursor-pointer">
                <Square size={14} /> Stop
              </button>
            ) : (
              <button onClick={startSimulation} disabled={!isConnected} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded flex items-center gap-1 text-sm transition-colors disabled:opacity-50 cursor-pointer">
                <Play size={14} /> Start Simulation
              </button>
            )}
          </div>
        </div>

        <div className="h-48 bg-slate-900 rounded-lg border border-slate-800 relative mb-4 p-2 flex items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#0ea5e9 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
          <RouteVisualizer routeData={routeData} />
        </div>

        {routeData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <h3 className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
                <Route size={16} /> Route Status
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">Current Optimal Route:</span>
                  <span className="text-brand-300 font-bold tracking-widest bg-brand-900/30 px-2 py-0.5 rounded border border-brand-500/20">
                    {routeData.alternateRoute?.join(' → ') || routeData.originalRoute?.join(' → ')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-sm">ETA Impact vs Baseline:</span>
                  <span className={`font-mono font-medium text-sm px-2 py-0.5 rounded ${routeData.metrics?.delta.startsWith('+') && routeData.metrics?.delta !== '+0 mins' ? 'bg-red-900/30 text-red-400 border border-red-500/20' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20'}`}>
                    {routeData.metrics?.delta}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-brand-500/5 rounded-lg p-4 border border-brand-500/20 relative">
              <h3 className="text-sm text-brand-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle size={16} /> AI Routing Explanation
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{routeData.aiExplanation}"
              </p>
              {routeData.disruptionEvent && (
                <div className="mt-3 inline-block bg-slate-900 px-3 py-1.5 rounded text-xs border border-slate-700 text-slate-400">
                  <span className="font-semibold text-white mr-1 capitalize">{routeData.disruptionEvent.type} Alert:</span> 
                  {routeData.disruptionEvent.message || 'Severity update'}
                </div>
              )}
            </div>

            {riskData && (
              <div className={`rounded-lg p-4 border relative ${getRiskBgColor(riskData.level)}`}>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 flex items-center gap-2 ${getRiskColor(riskData.level)}`}>
                  <ShieldAlert size={16} /> Route Risk
                </h3>
                <div className="space-y-3">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black" style={{color: riskData.level === 'High' ? '#f87171' : riskData.level === 'Medium' ? '#fbbf24' : '#34d399'}}>
                      {riskData.score}%
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${getRiskColor(riskData.level)} ${getRiskBgColor(riskData.level)}`}>
                      {riskData.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    {riskData.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
