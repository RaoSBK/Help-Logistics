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
    <div className="glass-panel h-full flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold flex items-center gap-2 text-slate-900 mb-4">
          <Clock className="text-blue-500" size={16} />
          Predictive ETA Offset
        </h2>
      </div>
      {!etaPrediction ? (
        <button onClick={fetchEta} disabled={loading} className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors shadow-sm">
          {loading ? 'Calculating...' : 'Calculate Dynamic ETA'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 mb-1 font-semibold">Standard ETA</p>
              <p className="text-2xl font-bold text-slate-900">{etaPrediction.originalEtaHours}h</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <p className="text-xs text-blue-600 mb-1 font-semibold">AI Adjusted ETA</p>
              <p className="text-2xl font-bold text-blue-700">{etaPrediction.newEtaHours}h</p>
            </div>
          </div>
          <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-2 rounded-md border-l-2 border-blue-500 shadow-sm">
            {etaPrediction.explanation}
          </p>
          <div className="text-center pt-2 mt-auto">
            <button onClick={fetchEta} className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center justify-center gap-1 mx-auto">
              <Clock size={12} /> Recalculate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
