import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { requestPredictEta } from '../../api';
import { Clock } from 'lucide-react';

export default function EtaPanel() {
  const { etaPrediction, setEtaPrediction } = useStore();
  const [loading, setLoading] = useState(false);

  const fetchEta = async () => {
    setLoading(true);
    try {
      const data = await requestPredictEta({ route_id: '123' });
      setEtaPrediction(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="text-brand-400" />
        Predictive ETA Offset
      </h2>
      {!etaPrediction ? (
        <button onClick={fetchEta} disabled={loading} className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
          {loading ? 'Calculating...' : 'Calculate Dynamic ETA'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1">Standard ETA</p>
              <p className="text-2xl font-bold text-slate-200">{etaPrediction.originalEtaHours}h</p>
            </div>
            <div className="bg-brand-900/40 p-3 rounded-lg border border-brand-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
              <p className="text-xs text-brand-300 mb-1">AI Adjusted ETA</p>
              <p className="text-2xl font-bold text-brand-400">{etaPrediction.newEtaHours}h</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 bg-slate-800/50 p-2 rounded-md border-l-2 border-brand-500">
            {etaPrediction.explanation}
          </p>
          <div className="text-center pt-2">
            <button onClick={fetchEta} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Recalculate</button>
          </div>
        </div>
      )}
    </div>
  );
}
