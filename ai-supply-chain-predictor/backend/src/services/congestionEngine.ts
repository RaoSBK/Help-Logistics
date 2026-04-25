// congestionEngine.ts
// Live congestion detection engine for corridor routing and network bottleneck analysis.
// Provides evolving edge state, continuous scanning, and event-aware congestion scoring.

export interface NodeMetrics {
  id: string;
  load: number;         // 0-100 utilization %
  throughput: number;   // packets/sec
  latency: number;      // ms
  packetLoss: number;   // 0-1
  connections: number;
}

export interface EdgeMetrics {
  from: string;
  to: string;
  bandwidth: number;    // Mbps capacity
  utilization: number;  // 0-1
  latency: number;      // ms
}

export interface BottleneckResult {
  detected: boolean;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  severityScore: number;       // 0-100
  cause: string;
  affectedNodes: string[];
  bottleneckEdge: { from: string; to: string } | null;
  criticalPath: string[];
  metrics: {
    avgLatency: number;
    peakLoad: number;
    congestionIndex: number;    // composite score
    affectedTrafficPct: number;
  };
  recommendation: string;
  warning: string;
  timestamp: number;
}

const TOPOLOGY: EdgeMetrics[] = [
  { from: 'A', to: 'B', bandwidth: 1000, utilization: 0, latency: 2 },
  { from: 'B', to: 'C', bandwidth: 500,  utilization: 0, latency: 3 },
  { from: 'C', to: 'D', bandwidth: 800,  utilization: 0, latency: 2 },
  { from: 'D', to: 'E', bandwidth: 600,  utilization: 0, latency: 4 },
  { from: 'B', to: 'D', bandwidth: 300,  utilization: 0, latency: 6 },
  { from: 'A', to: 'C', bandwidth: 700,  utilization: 0, latency: 5 },
  { from: 'C', to: 'E', bandwidth: 400,  utilization: 0, latency: 3 },
];

const ALL_NODES = ['A', 'B', 'C', 'D', 'E'];

const REGION_PATTERNS: Record<string, { baseLoad: number; burstChance: number }> = {
  'North Corridor': { baseLoad: 0.35, burstChance: 0.2 },
  'Central Hub': { baseLoad: 0.42, burstChance: 0.25 },
  'South Link': { baseLoad: 0.28, burstChance: 0.15 },
};

interface NetworkState {
  edges: EdgeMetrics[];
  lastUpdated: number;
}

const liveNetwork: Record<string, NetworkState> = {};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getTrafficPattern(region: string): { baseLoad: number; burstChance: number } {
  return REGION_PATTERNS[region] ?? REGION_PATTERNS['North Corridor']!;
}

function buildNodeMetrics(edges: EdgeMetrics[]): NodeMetrics[] {
  return ALL_NODES.map((id) => {
    const incidentEdges = edges.filter((edge) => edge.from === id || edge.to === id);
    const avgUtil = incidentEdges.reduce((sum, edge) => sum + edge.utilization, 0) / incidentEdges.length;
    return {
      id,
      load: parseFloat((avgUtil * 100).toFixed(1)),
      throughput: parseFloat(
        incidentEdges.reduce((sum, edge) => sum + edge.bandwidth * (1 - edge.utilization), 0).toFixed(0)
      ),
      latency: parseFloat(
        (incidentEdges.reduce((sum, edge) => sum + edge.latency, 0) / incidentEdges.length).toFixed(1)
      ),
      packetLoss: parseFloat(
        (avgUtil > 0.72 ? (avgUtil - 0.72) * 2.8 : 0).toFixed(3)
      ),
      connections: incidentEdges.length,
    };
  });
}

function initializeNetwork(region: string): NetworkState {
  const { baseLoad } = getTrafficPattern(region);
  const edges = TOPOLOGY.map((edge) => {
    const utilization = parseFloat(clamp(baseLoad + (Math.random() - 0.5) * 0.16, 0.1, 0.75).toFixed(3));
    return {
      ...edge,
      utilization,
      latency: parseFloat((edge.latency * (1 + utilization * 2.2 + Math.random() * 0.12)).toFixed(1)),
    };
  });

  const state = { edges, lastUpdated: Date.now() };
  liveNetwork[region] = state;
  return state;
}

function getRegionState(region: string): NetworkState {
  return liveNetwork[region] ?? initializeNetwork(region);
}

function evolveNetworkState(region: string): { nodes: NodeMetrics[]; edges: EdgeMetrics[] } {
  const state = getRegionState(region);
  const pattern = getTrafficPattern(region);
  const currentEdges = state.edges;
  const isIncident = Math.random() < pattern.burstChance;
  const hotEdgeIdx = isIncident
    ? Math.floor(Math.random() * currentEdges.length)
    : currentEdges.reduce((best, edge, idx) => (edge.utilization > currentEdges[best]!.utilization ? idx : best), 0);

  const edges = currentEdges.map((edge, idx) => {
    const original = TOPOLOGY.find((base) => base.from === edge.from && base.to === edge.to)!;
    const drift = (Math.random() - 0.5) * 0.08;
    const hotBoost = idx === hotEdgeIdx ? 0.18 : 0;
    const capacityPenalty = edge.bandwidth < 500 && edge.utilization > 0.68 ? 0.05 : 0;
    const utilization = parseFloat(
      clamp(edge.utilization + drift + hotBoost + capacityPenalty, 0.08, idx === hotEdgeIdx ? 0.99 : 0.88).toFixed(3)
    );
    const latency = parseFloat(
      (original.latency * (1 + utilization * 2.8 + Math.random() * 0.15)).toFixed(1)
    );
    return {
      ...edge,
      utilization,
      latency,
    };
  });

  state.edges = edges;
  state.lastUpdated = Date.now();
  return {
    edges,
    nodes: buildNodeMetrics(edges),
  };
}

function findBottleneckEdge(edges: EdgeMetrics[]): EdgeMetrics {
  return edges.reduce((max, edge) => (edge.utilization > max.utilization ? edge : max), edges[0]!);
}

function findCriticalPath(bottleneckEdge: EdgeMetrics, edges: EdgeMetrics[]): string[] {
  const adj: Record<string, string[]> = {};
  ALL_NODES.forEach((node) => { adj[node] = []; });
  edges.forEach((edge) => {
    adj[edge.from]!.push(edge.to);
    adj[edge.to]!.push(edge.from);
  });

  const queue: string[][] = [['A']];
  const visited = new Set<string>();
  while (queue.length) {
    const path = queue.shift()!;
    const node = path[path.length - 1]!;
    if (node === 'E') return path;
    if (visited.has(node)) continue;
    visited.add(node);
    for (const neighbor of adj[node]!) {
      queue.push([...path, neighbor]);
    }
  }

  return [bottleneckEdge.from, bottleneckEdge.to];
}

function scoreSeverity(utilization: number, avgLatency: number, packetLoss: number): {
  score: number;
  label: 'Low' | 'Medium' | 'High' | 'Critical';
} {
  const latencyFactor = Math.min(1, avgLatency / 100);
  const score = Math.round(utilization * 50 + latencyFactor * 30 + packetLoss * 20);

  let label: 'Low' | 'Medium' | 'High' | 'Critical';
  if (score >= 75) label = 'Critical';
  else if (score >= 50) label = 'High';
  else if (score >= 25) label = 'Medium';
  else label = 'Low';

  return { score, label };
}

const CAUSE_RULES: Array<{ condition: (e: EdgeMetrics, nodes: NodeMetrics[]) => boolean; cause: string }> = [
  {
    condition: (edge) => edge.utilization > 0.9,
    cause: 'Link Saturation — bandwidth exhausted on primary corridor',
  },
  {
    condition: (edge, nodes) => nodes.find((node) => node.id === edge.from || node.id === edge.to)?.packetLoss! > 0.08,
    cause: 'Packet Loss Cascade — retransmissions amplifying congestion',
  },
  {
    condition: (edge) => edge.latency > 25,
    cause: 'Latency Spike — queuing delay exceeds SLA threshold',
  },
  {
    condition: (edge) => edge.bandwidth < 400 && edge.utilization > 0.72,
    cause: 'Narrow Pipe Overload — low-capacity link under heavy demand',
  },
];

function detectCause(bottleneck: EdgeMetrics, nodes: NodeMetrics[]): string {
  for (const rule of CAUSE_RULES) {
    if (rule.condition(bottleneck, nodes)) return rule.cause;
  }
  return 'Traffic Surge — anomalous volume spike on network segment';
}

function getRecommendation(severity: string, bottleneckEdge: EdgeMetrics): string {
  if (severity === 'Critical') return `Immediate reroute via alternate path. Isolate ${bottleneckEdge.from}↔${bottleneckEdge.to} link.`;
  if (severity === 'High') return `Throttle non-priority traffic on ${bottleneckEdge.from}↔${bottleneckEdge.to}. Activate QoS policy.`;
  if (severity === 'Medium') return `Monitor ${bottleneckEdge.from}↔${bottleneckEdge.to} closely. Pre-stage failover routes.`;
  return `Log event. No immediate action required.`;
}

export const detectCongestion = async (data: any): Promise<BottleneckResult> => {
  const region = data?.region ?? 'North Corridor';
  const { nodes, edges } = evolveNetworkState(region);
  const bottleneckEdge = findBottleneckEdge(edges);
  const criticalPath = findCriticalPath(bottleneckEdge, edges);

  const affectedNodes = nodes
    .filter((node) => node.load > 70)
    .sort((a, b) => b.load - a.load)
    .map((node) => node.id);

  const worstNode = nodes.reduce((best, node) => (node.load > best.load ? node : best), nodes[0]!);
  const avgLatency = parseFloat((nodes.reduce((sum, node) => sum + node.latency, 0) / nodes.length).toFixed(1));
  const totalPacketLoss = parseFloat((nodes.reduce((sum, node) => sum + node.packetLoss, 0) / nodes.length).toFixed(4));

  const { score, label } = scoreSeverity(bottleneckEdge.utilization, avgLatency, totalPacketLoss);
  const cause = detectCause(bottleneckEdge, nodes);
  const congestionIndex = parseFloat(
    (bottleneckEdge.utilization * 55 + (avgLatency / 50) * 30 + totalPacketLoss * 15).toFixed(1)
  );
  const affectedTrafficPct = parseFloat(
    Math.max(
      bottleneckEdge.utilization * 100,
      (edges.filter((edge) => edge.utilization > 0.7).length / edges.length) * 100
    ).toFixed(1)
  );

  return {
    detected: true,
    severity: label,
    severityScore: score,
    cause,
    affectedNodes: affectedNodes.length > 0 ? affectedNodes : [worstNode.id],
    bottleneckEdge: { from: bottleneckEdge.from, to: bottleneckEdge.to },
    criticalPath,
    metrics: {
      avgLatency,
      peakLoad: worstNode.load,
      congestionIndex,
      affectedTrafficPct,
    },
    recommendation: getRecommendation(label, bottleneckEdge),
    warning: `[${label.toUpperCase()}] ${bottleneckEdge.from}↔${bottleneckEdge.to} at ${(bottleneckEdge.utilization * 100).toFixed(0)}% capacity. ${cause}.`,
    timestamp: Date.now(),
  };
};