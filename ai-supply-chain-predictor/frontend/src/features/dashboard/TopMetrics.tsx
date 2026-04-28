import { ShieldAlert, Truck, Map, Clock, WifiOff } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useLiveRoute } from '../live-routing/useLiveRoute';
import { useEffect, useRef, useState } from 'react';

// Animated counter hook
function useAnimatedCounter(target: number, duration = 600) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startValRef = useRef(target);

  useEffect(() => {
    startValRef.current = display;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(startValRef.current + (target - startValRef.current) * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return display;
}

// Percentage change between prev and current
function pctChange(curr: number, prev: number): { text: string; up: boolean; zero: boolean } {
  if (prev === 0) return { text: '— No change', up: false, zero: true };
  const diff = curr - prev;
  if (diff === 0) return { text: '— No change', up: false, zero: true };
  const pct = Math.abs(Math.round((diff / prev) * 100));
  return { text: `${Math.abs(diff)} (${pct}%)`, up: diff > 0, zero: false };
}

export default function TopMetrics() {
  const { isConnected } = useLiveRoute();
  const metrics = useStore((s) => s.dashboardMetrics);

  // Fallback baseline values shown before first socket message
  const baseline = { highRiskShipments: 7, activeShipments: 128, routesMonitored: 64, avgDelayMinutes: 23 };
  const prev = metrics?.prev ?? baseline;

  const highRisk        = metrics?.highRiskShipments ?? baseline.highRiskShipments;
  const active          = metrics?.activeShipments   ?? baseline.activeShipments;
  const routes          = metrics?.routesMonitored   ?? baseline.routesMonitored;
  const avgDelay        = metrics?.avgDelayMinutes   ?? baseline.avgDelayMinutes;

  const animHighRisk  = useAnimatedCounter(highRisk);
  const animActive    = useAnimatedCounter(active);
  const animRoutes    = useAnimatedCounter(routes);
  const animAvgDelay  = useAnimatedCounter(avgDelay);

  const riskTrend   = pctChange(highRisk,  prev.highRiskShipments);
  const activeTrend = pctChange(active,    prev.activeShipments);
  const routeTrend  = pctChange(routes,    prev.routesMonitored);
  const delayTrend  = pctChange(avgDelay,  prev.avgDelayMinutes);

  const Trend = ({ t, invert = false }: { t: ReturnType<typeof pctChange>; invert?: boolean }) => {
    if (t.zero) return <span className="text-slate-400">— No change</span>;
    // For risk & delay: up is BAD (red), down is GOOD (green). invert=true flips colours.
    const isGood = invert ? t.up : !t.up;
    const colour = isGood ? 'text-emerald-500' : 'text-red-500';
    const arrow  = t.up ? '↑' : '↓';
    return (
      <span className={colour}>
        {arrow} {t.text} <span className="text-slate-400 font-normal">vs prev</span>
      </span>
    );
  };

  return (
    <div className="px-8 mb-6">
      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-3">
        {isConnected ? (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Live</span>
          </>
        ) : (
          <>
            <WifiOff size={12} className="text-slate-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wide">Connecting…</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* High Risk Shipments */}
        <div className="glass-panel flex items-center gap-4 p-5 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/15 text-red-500 flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">High Risk Shipments</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">{animHighRisk}</div>
            <div className="text-xs font-medium mt-1 flex items-center gap-1">
              <Trend t={riskTrend} />
            </div>
          </div>
        </div>

        {/* Active Shipments */}
        <div className="glass-panel flex items-center gap-4 p-5 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-500 flex items-center justify-center flex-shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Active Shipments</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">{animActive}</div>
            <div className="text-xs font-medium mt-1 flex items-center gap-1">
              <Trend t={activeTrend} invert />
            </div>
          </div>
        </div>

        {/* Routes Monitored */}
        <div className="glass-panel flex items-center gap-4 p-5 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-500 flex items-center justify-center flex-shrink-0">
            <Map size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Routes Monitored</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">{animRoutes}</div>
            <div className="text-xs font-medium mt-1 flex items-center gap-1">
              <Trend t={routeTrend} invert />
            </div>
          </div>
        </div>

        {/* Avg Delay */}
        <div className="glass-panel flex items-center gap-4 p-5 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/15 text-orange-500 flex items-center justify-center flex-shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Avg. Delay (ETA)</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">{animAvgDelay} m</div>
            <div className="text-xs font-medium mt-1 flex items-center gap-1">
              <Trend t={delayTrend} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

