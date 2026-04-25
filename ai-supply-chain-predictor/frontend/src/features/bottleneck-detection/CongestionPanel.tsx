import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { requestDetectBottleneck } from '../../api';
import { AlertTriangle, Activity, Zap, GitBranch, ArrowRight, Clock3, RefreshCw } from 'lucide-react';

// Severity → color mapping (matches existing amber/slate palette)
const SEVERITY_COLORS: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  Low:      { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  bar: 'bg-green-500'  },
  Medium:   { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', bar: 'bg-yellow-400' },
  High:     { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-400',  bar: 'bg-amber-500'  },
  Critical: { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    bar: 'bg-red-500'    },
};

function MetricBar({ label, value, max = 100, unit = '%', color = 'bg-brand-400' }: {
  label: string; value: number; max?: number; unit?: string; color?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span className="text-slate-200 font-mono">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CongestionPanel() {
  const { bottleneck, setBottleneck } = useStore();
  const [loading, setLoading] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const pollInterval = 12000;

  const detect = async ({ auto = false } = {}) => {
    if (!auto) setLoading(true);
    setError(null);

    try {
      const data = await requestDetectBottleneck({ region: 'North Corridor' });
      setBottleneck(data);
      setLastUpdated(data.timestamp ?? Date.now());
      setScanCount((count) => count + 1);
    } catch (e) {
      console.error(e);
      setError('Unable to fetch live congestion data.');
    } finally {
      if (!auto) setLoading(false);
    }
  };

  useEffect(() => {
    if (!liveMode) return;

    detect({ auto: true });
    const interval = window.setInterval(() => detect({ auto: true }), pollInterval);
    return () => window.clearInterval(interval);
  }, [liveMode]);

  const colors = bottleneck ? (SEVERITY_COLORS[bottleneck.severity] ?? SEVERITY_COLORS.High) : SEVERITY_COLORS.High;

  return (
    <div className="glass-panel">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity className="text-brand-400" />
        Bottleneck Detection
      </h2>

      <div className="mb-4 text-xs text-slate-400 flex flex-wrap gap-2 items-center justify-between">
        <span>{liveMode ? 'Live monitoring enabled' : 'Manual scan only'}</span>
        <span className="flex items-center gap-1">
          <Clock3 size={14} />
          {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Awaiting data'}
        </span>
        <span>{scanCount > 0 ? `${scanCount} scans` : 'No scans yet'}</span>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!bottleneck ? (
        <button
          onClick={() => detect()}
          disabled={loading}
          className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Activity className="animate-spin" size={18} /> : 'Scan Network Congestion'}
        </button>
      ) : (
        <div className="space-y-3">

          {/* Severity Banner */}
          <div className={`flex items-center gap-3 ${colors.bg} border ${colors.border} p-4 rounded-lg`}>
            <div className={`p-2 ${colors.bg} rounded-full`}>
              <AlertTriangle className={colors.text} size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${colors.text} font-bold text-lg leading-tight`}>{bottleneck.severity} Congestion</p>
              <p className="text-slate-300 text-xs mt-0.5 truncate">{bottleneck.cause}</p>
            </div>
            {/* Severity score badge */}
            <div className="text-right shrink-0">
              <p className={`text-2xl font-mono font-bold ${colors.text}`}>{bottleneck.severityScore ?? ''}</p>
              <p className="text-xs text-slate-500">/ 100</p>
            </div>
          </div>

          {/* Metric Bars */}
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 space-y-2.5">
            <MetricBar
              label="Peak Node Load"
              value={bottleneck.metrics?.peakLoad ?? 0}
              color={colors.bar}
            />
            <MetricBar
              label="Avg Latency"
              value={bottleneck.metrics?.avgLatency ?? 0}
              max={150}
              unit="ms"
              color={colors.bar}
            />
            <MetricBar
              label="Congestion Index"
              value={bottleneck.metrics?.congestionIndex ?? 0}
              max={100}
              unit=""
              color={colors.bar}
            />
            <MetricBar
              label="Affected Traffic"
              value={bottleneck.metrics?.affectedTrafficPct ?? 0}
              color={colors.bar}
            />
          </div>

          {/* Bottleneck Edge + Affected Nodes */}
          <div className="grid grid-cols-2 gap-2">
            {bottleneck.bottleneckEdge && (
              <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                <p className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
                  <Zap size={10} className="text-brand-400" /> Hot Link
                </p>
                <p className="font-mono text-sm text-white font-bold flex items-center gap-1">
                  {bottleneck.bottleneckEdge.from}
                  <ArrowRight size={12} className="text-slate-500" />
                  {bottleneck.bottleneckEdge.to}
                </p>
              </div>
            )}
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
                <AlertTriangle size={10} className="text-amber-400" /> Impacted
              </p>
              <div className="flex flex-wrap gap-1">
                {bottleneck.affectedNodes.map((n: string) => (
                  <span key={n} className="px-1.5 py-0.5 bg-slate-700 text-slate-200 text-xs rounded font-mono border border-slate-600">{n}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Critical Path */}
          {bottleneck.criticalPath?.length > 0 && (
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400 mb-1.5 flex items-center gap-1">
                <GitBranch size={10} className="text-brand-400" /> Critical Path
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                {bottleneck.criticalPath.map((n: string, i: number) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-slate-700 text-slate-200 text-xs rounded font-mono border border-slate-600">{n}</span>
                    {i < bottleneck.criticalPath.length - 1 && <ArrowRight size={10} className="text-slate-600" />}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {bottleneck.recommendation && (
            <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-1">Recommended Action</p>
              <p className="text-xs text-slate-300">{bottleneck.recommendation}</p>
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => detect()}
              disabled={loading}
              className="w-full bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Activity className="animate-spin" size={14} /> : '↺ Re-scan'}
            </button>
            <button
              onClick={() => setLiveMode((value) => !value)}
              className={`w-full ${liveMode ? 'bg-amber-600 hover:bg-amber-500' : 'bg-slate-700 hover:bg-slate-600'} border border-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2`}
            >
              <RefreshCw size={14} />
              {liveMode ? 'Stop Live Monitoring' : 'Start Live Monitoring'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}