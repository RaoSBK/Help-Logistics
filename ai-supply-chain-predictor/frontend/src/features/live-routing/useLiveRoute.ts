import { useState, useEffect } from 'react';
import { socket } from './routeSocketClient';
import { useStore } from '../../store/useStore';
import type { DashboardMetrics } from '../../store/useStore';

export interface RouteUpdate {
  originalRoute: string[];
  alternateRoute: string[];
  metrics: {
    originalEta: number;
    newEta: number;
    delta: string;
  };
  eta?: {
    totalEtaMinutes: number;
    breakdown: {
      base: number;
      trafficDelay: number;
      weatherDelay: number;
      congestion: number;
      riskBuffer: number;
    };
    confidence: number;
    estimatedArrival: string;
    explanation: string;
  };
  aiExplanation: string;
  disruptionEvent?: any;
  graphEdges?: {node: string, edges: any[]}[];
}

/** Convert a route_update payload into a notification */
function routeUpdateToNotification(data: RouteUpdate) {
  const { addNotification } = useStore.getState();
  const ev = data.disruptionEvent;

  if (!ev) return;

  if (ev.type === 'recovery') {
    addNotification({
      title: '✅ Route Recovered',
      message: 'Network conditions normalized. All primary routes are clear.',
      severity: 'success',
    });
    return;
  }

  const from = ev.from ?? '?';
  const to   = ev.to   ?? '?';
  const delta = data.metrics?.delta ?? '';
  const isClosure = ev.severityMultiplier === Infinity || ev.penalty === Infinity;

  if (ev.type === 'traffic') {
    if (isClosure) {
      addNotification({
        title: '🚨 Route Closure Detected',
        message: `Segment ${from}→${to} is fully blocked. Rerouting in progress. ETA impact: ${delta}.`,
        severity: 'critical',
      });
    } else {
      addNotification({
        title: '⚠️ Traffic Delay',
        message: `Heavy traffic on ${from}→${to}. ETA impact: ${delta}.`,
        severity: 'warning',
      });
    }
  } else if (ev.type === 'weather') {
    addNotification({
      title: '🌧️ Weather Alert',
      message: `Adverse weather on ${from}→${to}. Route adjusted. ETA impact: ${delta}.`,
      severity: 'warning',
    });
  } else {
    addNotification({
      title: '📡 Route Updated',
      message: data.aiExplanation?.slice(0, 120) ?? 'Route has been recomputed.',
      severity: 'info',
    });
  }
}

/** Watch for high risk spikes */
let prevHighRisk = 0;
function metricsToNotification(data: DashboardMetrics) {
  const { addNotification } = useStore.getState();
  if (data.highRiskShipments > prevHighRisk && data.highRiskShipments >= 15) {
    addNotification({
      title: '🔴 High Risk Alert',
      message: `${data.highRiskShipments} shipments are now in high-risk status. Immediate review recommended.`,
      severity: 'critical',
    });
  }
  if (data.avgDelayMinutes > (data.prev?.avgDelayMinutes ?? 0) + 10) {
    addNotification({
      title: '⏱️ Delay Spike',
      message: `Average delay jumped to ${data.avgDelayMinutes} min. Check active disruptions.`,
      severity: 'warning',
    });
  }
  prevHighRisk = data.highRiskShipments;
}

export const useLiveRoute = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [routeData, setRouteData] = useState<RouteUpdate | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      useStore.getState().addNotification({
        title: '🟢 Connected',
        message: 'Live logistics feed connected. Monitoring all routes in real-time.',
        severity: 'info',
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setIsSimulating(false);
      useStore.getState().addNotification({
        title: '🔌 Disconnected',
        message: 'Lost connection to logistics feed. Attempting to reconnect…',
        severity: 'critical',
      });
    });

    socket.on('initial_route', (data: RouteUpdate) => {
      setRouteData(data);
      if (data.eta) useStore.getState().setEtaPrediction(data.eta);
    });

    socket.on('route_update', (data: RouteUpdate) => {
      setRouteData(data);
      if (data.eta) useStore.getState().setEtaPrediction(data.eta);
      routeUpdateToNotification(data);
    });

    socket.on('dashboard_metrics_update', (data: DashboardMetrics) => {
      useStore.getState().setDashboardMetrics(data);
      metricsToNotification(data);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('initial_route');
      socket.off('route_update');
      socket.off('dashboard_metrics_update');
    };
  }, []);

  const startSimulation = () => {
    socket.emit('start_simulation', { start: 'A', end: 'D' });
    setIsSimulating(true);
  };

  const stopSimulation = () => {
    socket.emit('stop_simulation');
    setIsSimulating(false);
  };

  return {
    isConnected,
    isSimulating,
    routeData,
    startSimulation,
    stopSimulation
  };
};
