import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { requestRiskScore } from '../../api';
import { ShieldAlert, RefreshCw, TrendingUp, AlertTriangle, CloudRain, Car, Route, Clock } from 'lucide-react';

export default function RiskPanel() {
  const { riskScore, setRiskScore } = useStore();
  const [loading, setLoading] = useState(false);
  const [riskHistory, setRiskHistory] = useState<number[]>([]);

  const fetchScore = async () => {
    setLoading(true);
    try {
      const data = await requestRiskScore({ route: 'A-D' });
      setRiskScore(data);
      setRiskHistory(prev => [...prev.slice(-4), data.score]); // Keep last 5 scores
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Calculate risk factors based on score (client-side simulation)
  const getRiskFactors = (score: number) => ({
    weather: Math.round(score * 0.3),
    traffic: Math.round(score * 0.4),
    disruption: Math.round(score * 0.3)
  });

  const factors = riskScore ? (riskScore.factors || getRiskFactors(riskScore.score)) : null;

  return (
    <div className="glass-panel relative overflow-hidden group h-full flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
        <ShieldAlert size={80} className="text-slate-900" />
      </div>
      <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-900">
        <ShieldAlert className="text-blue-500" size={16} />
        AI Risk Engine
      </h2>
      
      {!riskScore ? (
        <div className="flex flex-col items-center justify-center py-8 flex-1">
          <p className="text-slate-500 mb-4 text-center text-sm">No active shipment analyzed.</p>
          <button onClick={fetchScore} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm">
            {loading ? <RefreshCw className="animate-spin" size={16} /> : 'Scan Current Route'}
          </button>
        </div>
      ) : (
        <div className="space-y-4 relative z-10 flex-1 flex flex-col">
          <div className="flex items-end gap-3">
            <div className={`text-4xl font-black ${riskScore.level === 'High' ? 'text-red-500' : riskScore.level === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
              {riskScore.score}<span className="text-2xl text-slate-400 font-bold">/100</span>
            </div>
            <div className={`text-sm font-bold pb-1 ${riskScore.level === 'High' ? 'text-red-500' : riskScore.level === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
              {riskScore.level} Risk
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-blue-500 pl-3">
              "{riskScore.explanation}"
            </p>
          </div>
          
          {/* Risk Factors Breakdown */}
          {factors && (
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                Risk Factors
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Route size={14} className="text-purple-500" />
                  <span className="text-xs text-slate-600 flex-1 font-medium">Route</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(factors.route, 100)}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-900 font-semibold w-8 text-right">{factors.route}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <CloudRain size={14} className="text-blue-500" />
                  <span className="text-xs text-slate-600 flex-1 font-medium">Weather</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(factors.weather, 100)}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-900 font-semibold w-8 text-right">{factors.weather}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car size={14} className="text-orange-500" />
                  <span className="text-xs text-slate-600 flex-1 font-medium">Traffic</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${Math.min(factors.traffic, 100)}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-900 font-semibold w-8 text-right">{factors.traffic}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={14} className="text-emerald-500" />
                  <span className="text-xs text-slate-600 flex-1 font-medium">Time</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(factors.time, 100)}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-900 font-semibold w-8 text-right">{factors.time}%</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Risk History Trend */}
          {riskHistory.length > 1 && (
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-500" />
                Risk Trend (Last 5 Scans)
              </h3>
              <div className="flex items-end gap-1 h-12">
                {riskHistory.map((score, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t ${score > 60 ? 'bg-red-500' : score > 30 ? 'bg-amber-500' : 'bg-emerald-500'} transition-all duration-300 opacity-80`}
                      style={{ height: `${(score / 100) * 100}%` }}
                    ></div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-1">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button onClick={fetchScore} className="mt-auto w-full text-blue-600 hover:bg-slate-50 border border-slate-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2 py-2.5 rounded-lg shadow-sm">
            <RefreshCw size={14} /> Re-evaluate Risk
          </button>
        </div>
      )}
    </div>
  );
}
