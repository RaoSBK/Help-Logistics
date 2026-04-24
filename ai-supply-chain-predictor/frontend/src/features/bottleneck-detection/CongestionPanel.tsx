import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { requestDetectBottleneck } from '../../api';
import { AlertTriangle, Activity } from 'lucide-react';

export default function CongestionPanel() {
  const { bottleneck, setBottleneck } = useStore();
  const [loading, setLoading] = useState(false);

  const detect = async () => {
    setLoading(true);
    try {
      const data = await requestDetectBottleneck({ region: 'North Corridor' });
      setBottleneck(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="glass-panel">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity className="text-brand-400" />
        Bottleneck Detection
      </h2>
      {!bottleneck ? (
        <button onClick={detect} disabled={loading} className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
          {loading ? <Activity className="animate-spin" size={18} /> : 'Scan Network Congestion'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
            <div className="p-2 bg-amber-500/20 rounded-full">
              <AlertTriangle className="text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-amber-400 font-bold text-lg">{bottleneck.severity} Congestion</p>
              <p className="text-slate-300 text-sm">Cause: {bottleneck.cause}</p>
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Impacted Nodes</p>
            <div className="flex gap-2">
              {bottleneck.affectedNodes.map((n: string) => (
                <span key={n} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded font-mono border border-slate-600">{n}</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 italic">
            "{bottleneck.warning}"
          </p>
        </div>
      )}
    </div>
  );
}
