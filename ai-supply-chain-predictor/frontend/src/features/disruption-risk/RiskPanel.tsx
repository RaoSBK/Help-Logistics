import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { requestRiskScore } from '../../api';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function RiskPanel() {
  const { riskScore, setRiskScore } = useStore();
  const [loading, setLoading] = useState(false);

  const fetchScore = async () => {
    setLoading(true);
    try {
      const data = await requestRiskScore({ route: 'A-D' });
      setRiskScore(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

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
          <button onClick={fetchScore} className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors flex items-center gap-2 mt-4">
            <RefreshCw size={14} /> Re-evaluate Risk
          </button>
        </div>
      )}
    </div>
  );
}
