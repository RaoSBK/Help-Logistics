import { useLiveRoute } from './useLiveRoute';
import RouteVisualizer from './RouteVisualizer';
import { Play, Square, Activity, AlertTriangle, Route } from 'lucide-react';

export default function LiveRouteDashboard() {
  const { isConnected, isSimulating, routeData, startSimulation, stopSimulation } = useLiveRoute();

  return (
    <div className="space-y-6">
      <div className="glass-panel relative overflow-hidden h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold flex items-center gap-2 text-slate-900">
            <Activity className="text-blue-500" size={16} />
            Live Network Monitor
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium bg-slate-50 px-2 py-1 rounded-full border border-slate-200 text-slate-700">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <span className="hidden sm:inline">{isConnected ? 'Socket Connected' : 'Disconnected'}</span>
            </div>
            {isSimulating ? (
              <button onClick={stopSimulation} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-medium transition-colors cursor-pointer">
                <Square size={12} /> Stop
              </button>
            ) : (
              <button onClick={startSimulation} disabled={!isConnected} className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 px-3 py-1 rounded-lg flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer">
                <Play size={12} /> Start Simulation
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-[300px] bg-[#eef2f6] rounded-lg border border-slate-200 relative mb-4 p-2 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
          <RouteVisualizer routeData={routeData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm min-h-[120px]">
            <h3 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Route size={14} className="text-blue-500" /> Route Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">Current Optimal Route:</span>
                <span className="text-slate-900 font-bold tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-sm">
                  {routeData ? (routeData.alternateRoute?.join(' → ') || routeData.originalRoute?.join(' → ')) : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">ETA Impact vs Baseline:</span>
                <span className={`font-mono font-medium text-xs px-2 py-0.5 rounded ${routeData?.metrics?.delta?.startsWith('+') && routeData?.metrics?.delta !== '+0 mins' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                  {routeData?.metrics?.delta || '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 relative shadow-sm min-h-[120px]">
            <h3 className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle size={14} /> AI Routing Explanation
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed italic min-h-[40px]">
              {routeData ? `"${routeData.aiExplanation}"` : 'Waiting for data...'}
            </p>
            {routeData?.disruptionEvent && (
              <div className="mt-3 inline-block bg-white px-3 py-1.5 rounded text-xs border border-slate-200 text-slate-600 shadow-sm">
                <span className="font-semibold text-orange-600 mr-1 capitalize">{routeData.disruptionEvent.type} Alert:</span> 
                {routeData.disruptionEvent.message || 'Severity update'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
