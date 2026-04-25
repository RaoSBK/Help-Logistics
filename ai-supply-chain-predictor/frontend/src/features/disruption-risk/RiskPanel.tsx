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
    <div className="glass-panel relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <ShieldAlert size={80} />
      </div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ShieldAlert className="text-brand-400" />
        AI Risk Engine
      </h2>
      
      {!riskScore ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-slate-400 mb-4 text-center">No active shipment analyzed.</p>
          <button onClick={fetchScore} disabled={loading} className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            {loading ? <RefreshCw className="animate-spin" size={18} /> : 'Scan Current Route'}
          </button>
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          <div className="flex items-end gap-4">
            <div className={`text-5xl font-black ${riskScore.level === 'High' ? 'text-red-400' : riskScore.level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {riskScore.score}/100
            </div>
            <div className={`text-lg font-bold ${riskScore.level === 'High' ? 'text-red-400' : riskScore.level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {riskScore.level} Risk
            </div>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-brand-500 pl-3">
              "{riskScore.explanation}"
            </p>
          </div>
          
          {/* Risk Factors Breakdown */}
          {factors && (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <AlertTriangle size={16} />
                Risk Factors
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Route size={16} className="text-purple-400" />
                  <span className="text-sm text-slate-300 flex-1">Route</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${Math.min(factors.route, 100)}%` }}></div>
                  </div>
                  <span className="text-sm text-slate-300 w-8">{factors.route}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <CloudRain size={16} className="text-blue-400" />
                  <span className="text-sm text-slate-300 flex-1">Weather</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${Math.min(factors.weather, 100)}%` }}></div>
                  </div>
                  <span className="text-sm text-slate-300 w-8">{factors.weather}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Car size={16} className="text-orange-400" />
                  <span className="text-sm text-slate-300 flex-1">Traffic</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${Math.min(factors.traffic, 100)}%` }}></div>
                  </div>
                  <span className="text-sm text-slate-300 w-8">{factors.traffic}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-green-400" />
                  <span className="text-sm text-slate-300 flex-1">Time</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: `${Math.min(factors.time, 100)}%` }}></div>
                  </div>
                  <span className="text-sm text-slate-300 w-8">{factors.time}%</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Risk History Trend */}
          {riskHistory.length > 1 && (
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <TrendingUp size={16} />
                Risk Trend (Last 5 Scans)
              </h3>
              <div className="flex items-end gap-1 h-16">
                {riskHistory.map((score, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t ${score > 60 ? 'bg-red-400' : score > 30 ? 'bg-amber-400' : 'bg-emerald-400'} transition-all duration-300`}
                      style={{ height: `${(score / 100) * 100}%` }}
                    ></div>
                    <span className="text-xs text-slate-400 mt-1">{score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button onClick={fetchScore} className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors flex items-center gap-2 mt-4">
            <RefreshCw size={14} /> Re-evaluate Risk
          </button>
        </div>
      )}
    </div>
  );
}
