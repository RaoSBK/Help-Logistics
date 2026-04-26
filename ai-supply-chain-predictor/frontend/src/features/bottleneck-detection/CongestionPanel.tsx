import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { requestDetectBottleneck } from '../../api';
import { socket } from '../live-routing/routeSocketClient';
import { AlertTriangle, Activity, Zap, GitBranch, ArrowRight, Clock3, RefreshCw } from 'lucide-react';

// Severity → color mapping
const SEVERITY_COLORS: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  Low:      { bg: 'bg-emerald-50',  border: 'border-emerald-200',  text: 'text-emerald-600',  bar: 'bg-emerald-500'  },
  Medium:   { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', bar: 'bg-amber-500' },
  High:     { bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-600',  bar: 'bg-orange-500'  },
  Critical: { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-600',    bar: 'bg-red-500'    },
};

function MetricBar({ label, value, max = 100, unit = '%', color = 'bg-brand-400' }: {
  label: string; value: number; max?: number; unit?: string; color?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{label}</span>
        <span className="text-slate-900 font-mono font-semibold">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CongestionPanel() {
  const { bottleneck, setBottleneck } = useStore();
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [nextRefreshInSec, setNextRefreshInSec] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [refreshReason, setRefreshReason] = useState<string | null>(null);
  const nextRefreshDeadline = useRef<number | null>(null);
  const liveModeRef = useRef(liveMode);
  const refreshReasonTimeout = useRef<number | null>(null);
  const lastAutoRefresh = useRef<number>(0);
  const pollIntervalSeconds = 12;
  const pollInterval = pollIntervalSeconds * 1000;
  const minAutoRefreshInterval = pollInterval;

  const updateCountdown = () => {
    if (!nextRefreshDeadline.current) return;
    const remainingMs = Math.max(0, nextRefreshDeadline.current - Date.now());
    const seconds = Math.ceil(remainingMs / 1000);
    setNextRefreshInSec(seconds);
  };

  const clearRefreshReason = () => {
    if (refreshReasonTimeout.current) {
      window.clearTimeout(refreshReasonTimeout.current);
      refreshReasonTimeout.current = null;
    }
  };

  const resetCountdown = () => {
    nextRefreshDeadline.current = Date.now() + pollInterval;
    setNextRefreshInSec(pollIntervalSeconds);
  };

  const showRefreshReason = (message: string, persist = false) => {
    clearRefreshReason();
    setRefreshReason(message);
    if (!persist) {
      refreshReasonTimeout.current = window.setTimeout(() => {
        setRefreshReason(null);
        refreshReasonTimeout.current = null;
      }, 6000);
    }
  };

  const detect = async ({ auto = false } = {}) => {
    const now = Date.now();

    if (auto && now - lastAutoRefresh.current < minAutoRefreshInterval) {
      return;
    }

    if (!auto) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);

    try {
      const data = await requestDetectBottleneck({ region: 'North Corridor' });
      setBottleneck({
        ...data,
        metrics: { ...data.metrics },
        bottleneckEdge: data.bottleneckEdge ? { ...data.bottleneckEdge } : null,
        criticalPath: [...(data.criticalPath ?? [])],
        affectedNodes: [...(data.affectedNodes ?? [])],
      });
      setLastUpdated(data.timestamp ?? Date.now());
      setScanCount((count) => count + 1);

      if (auto) {
        lastAutoRefresh.current = now;
        resetCountdown();
      }
    } catch (e) {
      console.error(e);
      setError('Unable to fetch live congestion data.');
      showRefreshReason('Live refresh failed. Retrying shortly...');
    } finally {
      if (!auto) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    liveModeRef.current = liveMode;
  }, [liveMode]);

  useEffect(() => {
    if (!liveMode) {
      nextRefreshDeadline.current = null;
      setNextRefreshInSec(null);
      clearRefreshReason();
      return;
    }

    detect({ auto: true });
    updateCountdown();

    const countdownTimer = window.setInterval(() => {
      updateCountdown();
    }, 1000);

    const refreshTimer = window.setInterval(() => {
      detect({ auto: true });
    }, pollInterval);

    return () => {
      window.clearInterval(countdownTimer);
      window.clearInterval(refreshTimer);
    };
  }, [liveMode]);

  useEffect(() => {
    const handleRouteUpdate = (data: any) => {
      if (!liveModeRef.current) return;
      if (data?.disruptionEvent) {
        const now = Date.now();
        if (now - lastAutoRefresh.current < minAutoRefreshInterval) {
          return;
        }
        detect({ auto: true });
      }
    };

    if (!socket.connected) {
      socket.connect();
    }

    socket.on('route_update', handleRouteUpdate);

    return () => {
      socket.off('route_update', handleRouteUpdate);
    };
  }, []);

  const colors = bottleneck ? (SEVERITY_COLORS[bottleneck.severity] ?? SEVERITY_COLORS.High) : SEVERITY_COLORS.High;

  return (
    <div className="glass-panel h-full flex flex-col">
      <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-900">
        <Activity className="text-blue-500" size={16} />
        Bottleneck Detection
      </h2>

      <div className="mb-4 text-xs text-slate-400 flex flex-wrap gap-2 items-center justify-between">
        <span>{liveMode ? 'Live scan active' : 'Manual scan only'}</span>
        <span className="flex items-center gap-1">
          <Clock3 size={14} />
          {lastUpdated ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Awaiting data'}
        </span>
        <span>{nextRefreshInSec !== null ? `Next refresh in ${nextRefreshInSec}s` : 'No live countdown'}</span>
        <span>{scanCount > 0 ? `${scanCount} scans` : 'No scans yet'}</span>
      </div>
      {refreshReason && (
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-slate-700">
          {refreshReason}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {!bottleneck ? (
        <button
          onClick={() => detect()}
          disabled={loading}
          className="w-full mt-auto bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <Activity className="animate-spin text-blue-500" size={18} /> : 'Scan Network Congestion'}
        </button>
      ) : (
        <div className="space-y-3">

          {/* Severity Banner */}
          <div className={`flex items-center gap-3 ${colors.bg} border ${colors.border} p-4 rounded-lg`}>
            <div className={`p-2 ${colors.bg} rounded-full`}>
              <AlertTriangle className={colors.text} size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${colors.text} font-bold text-sm leading-tight`}>{bottleneck.severity} Congestion</p>
              <p className="text-slate-500 text-xs mt-0.5 truncate">{bottleneck.cause}</p>
            </div>
            {/* Severity score badge */}
            <div className="text-right shrink-0">
              <p className={`text-2xl font-mono font-bold ${colors.text}`}>{bottleneck.severityScore ?? ''}</p>
              <p className="text-xs text-slate-500">/ 100</p>
            </div>
          </div>

          {/* Metric Bars */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2.5">
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
          <div className={`grid grid-cols-2 gap-2 transition-all ${isRefreshing ? 'animate-pulse' : ''}`}>
            {bottleneck.bottleneckEdge && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 mb-1.5 flex items-center gap-1 font-semibold">
                  <Zap size={10} className="text-blue-500" /> Hot Link
                </p>
                <p className="font-mono text-sm text-slate-900 font-bold flex items-center gap-1">
                  {bottleneck.bottleneckEdge.from}
                  <ArrowRight size={12} className="text-slate-400" />
                  {bottleneck.bottleneckEdge.to}
                </p>
              </div>
            )}
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 mb-1.5 flex items-center gap-1 font-semibold">
                <AlertTriangle size={10} className="text-amber-500" /> Impacted
              </p>
              <div className="flex flex-wrap gap-1">
                {bottleneck.affectedNodes.map((n: string) => (
                  <span key={n} className="px-1.5 py-0.5 bg-slate-50 text-slate-700 text-xs rounded font-mono border border-slate-200">{n}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Critical Path */}
          {bottleneck.criticalPath?.length > 0 && (
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 mb-1.5 flex items-center gap-1 font-semibold">
                <GitBranch size={10} className="text-blue-500" /> Critical Path
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                {bottleneck.criticalPath.map((n: string, i: number) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-700 text-xs rounded font-mono border border-slate-200">{n}</span>
                    {i < bottleneck.criticalPath.length - 1 && <ArrowRight size={10} className="text-slate-400" />}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation */}
          {bottleneck.recommendation && (
            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold mb-1">Recommended Action</p>
              <p className="text-xs text-slate-700">{bottleneck.recommendation}</p>
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2 mt-auto pt-2">
            <button
              onClick={() => detect()}
              disabled={loading}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <Activity className="animate-spin text-blue-500" size={14} /> : '↺ Re-scan'}
            </button>
            <button
              onClick={() => setLiveMode((value) => !value)}
              className={`w-full ${liveMode ? 'bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-200' : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'} border px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm`}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              {liveMode ? (isRefreshing ? 'Refreshing Live Data' : 'Stop Live Monitoring') : 'Start Live Monitoring'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}