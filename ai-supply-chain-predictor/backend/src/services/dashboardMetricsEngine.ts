import { eventBus, EVENTS } from './eventBus';

export interface DashboardMetrics {
  highRiskShipments: number;
  activeShipments: number;
  routesMonitored: number;
  avgDelayMinutes: number;
  // Comparison vs previous tick (for trend arrows)
  prev: {
    highRiskShipments: number;
    activeShipments: number;
    routesMonitored: number;
    avgDelayMinutes: number;
  };
}

// Internal state
let state = {
  highRiskShipments: 7,
  activeShipments: 128,
  routesMonitored: 64,
  avgDelayMinutes: 23,
};

let prev = { ...state };

let intervalId: NodeJS.Timeout | null = null;

/** Small random jitter between -range and +range */
const jitter = (range: number) => Math.floor((Math.random() - 0.5) * 2 * range);

/** Clamp a number to [min, max] */
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function tick() {
  prev = { ...state };

  // Natural drift – simulates real-world churn
  state.activeShipments  = clamp(state.activeShipments  + jitter(4), 110, 160);
  state.routesMonitored  = clamp(state.routesMonitored  + jitter(2),  55,  80);
  state.avgDelayMinutes  = clamp(state.avgDelayMinutes  + jitter(3),   5,  45);
  // Risk shipments drift more slowly
  state.highRiskShipments = clamp(state.highRiskShipments + jitter(2), 2, 20);

  emitMetrics();
}

function emitMetrics() {
  const payload: DashboardMetrics = {
    ...state,
    prev,
  };
  eventBus.emit(EVENTS.DASHBOARD_METRICS_UPDATED, payload);
}

/** Called externally when a disruption event fires – spikes the risk metric */
function onDisruption(eventInfo: any) {
  prev = { ...state };

  if (!eventInfo) return;

  if (eventInfo.type === 'recovery') {
    // Risk drops after recovery
    state.highRiskShipments = clamp(state.highRiskShipments - Math.floor(Math.random() * 3 + 1), 2, 20);
    state.avgDelayMinutes   = clamp(state.avgDelayMinutes   - Math.floor(Math.random() * 5 + 1), 5, 45);
  } else {
    // Disruption → more risk shipments, longer delays
    state.highRiskShipments = clamp(state.highRiskShipments + Math.floor(Math.random() * 3 + 1), 2, 20);
    state.avgDelayMinutes   = clamp(state.avgDelayMinutes   + Math.floor(Math.random() * 6 + 2), 5, 45);
  }

  emitMetrics();
}

export const startDashboardMetricsEngine = () => {
  if (intervalId) return;
  console.log('[DashboardMetricsEngine] Starting...');
  // Emit immediately on start so clients get data right away
  emitMetrics();
  intervalId = setInterval(tick, 8000); // update every 8 seconds
};

export const stopDashboardMetricsEngine = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[DashboardMetricsEngine] Stopped.');
  }
};

export const getCurrentMetrics = (): DashboardMetrics => ({
  ...state,
  prev,
});

// React to disruption events to spike/drop metrics automatically
eventBus.on(EVENTS.DISRUPTION_DETECTED, ({ eventInfo }: any) => {
  onDisruption(eventInfo);
});
