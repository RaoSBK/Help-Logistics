import { createMockNetwork, Graph } from '../algorithms/graph';
import { runAStar } from '../algorithms/astar';
import { generateRouteExplanation } from './explanationEngine';

interface RouteSegment {
  from: string;
  to: string;
  time: number;
  risk: 'Low' | 'Medium' | 'High';
  note: string;
}

const LIVE_TRAFFIC_PROFILE: Record<string, number> = {
  'A-B': 1.1,
  'A-C': 1.0,
  'B-D': 1.2,
  'B-C': 1.3,
  'C-D': 1.4,
  'C-E': 1.0,
  'E-D': 1.1,
};

const applyLiveTraffic = (graph: Graph) => {
  graph.edges.forEach((edges) => {
    edges.forEach((edge) => {
      const key = `${edge.from}-${edge.to}`;
      const multiplier = LIVE_TRAFFIC_PROFILE[key] ?? 1;
      const jitter = 1 + (Math.random() * 0.18 - 0.09);
      edge.weight = parseFloat((edge.weight * multiplier * jitter).toFixed(1));
    });
  });
};

const applyPreferenceModifiers = (graph: Graph, preference: string) => {
  graph.edges.forEach((edges) => {
    edges.forEach((edge) => {
      if (preference === 'safest') {
        if (edge.to === 'C' || edge.from === 'C' || edge.to === 'E') {
          edge.weight = parseFloat((edge.weight * 1.3).toFixed(1));
        }
      }
      if (preference === 'balanced') {
        if (edge.to === 'C' || edge.from === 'C') {
          edge.weight = parseFloat((edge.weight * 1.15).toFixed(1));
        }
      }
      if (preference === 'eco') {
        if (edge.to === 'C' || edge.from === 'C' || edge.to === 'E') {
          edge.weight = parseFloat((edge.weight * 1.35).toFixed(1));
        }
      }
    });
  });
};

const getEdgeDetails = (graph: Graph, from: string, to: string) => {
  const edge = graph.getNeighbors(from).find((item) => item.to === to);
  if (!edge) return null;
  const time = parseFloat((edge.weight * edge.disruptionMultiplier).toFixed(1));
  const effectiveLoad = edge.weight * (edge.disruptionMultiplier === Infinity ? 2 : edge.disruptionMultiplier);
  const risk = effectiveLoad > 18 ? 'High' : effectiveLoad > 13 ? 'Medium' : 'Low';
  return {
    time,
    risk,
  };
};

const buildRouteSegments = (graph: Graph, path: string[]): RouteSegment[] => {
  if (path.length < 2) return [];
  return path.slice(0, -1).map((node, index) => {
    const next = path[index + 1]!;
    const edge = getEdgeDetails(graph, node, next);
    const risk = (edge?.risk ?? 'Low') as 'Low' | 'Medium' | 'High';
    return {
      from: node,
      to: next,
      time: edge?.time ?? 0,
      risk,
      note: risk === 'High' ? 'High traffic or narrow pass' : risk === 'Medium' ? 'Moderate caution recommended' : 'Clear route',
    };
  });
};

export const findAlternateRoute = async (data: any) => {
  const { start = 'A', end = 'D', disruption, routePreference = 'fastest' } = data || {};
  
  const graph = createMockNetwork();
  const originalGraph = createMockNetwork();
  const originalResult = runAStar(originalGraph, start, end);
  
  let aiExplanation = 'Optimal route calculated under normal conditions. No disruptions detected.';

  applyLiveTraffic(graph);
  applyPreferenceModifiers(graph, routePreference);

  if (disruption) {
    const { fromNode, toNode, severityMultiplier } = disruption;
    graph.applyDisruption(fromNode, toNode, severityMultiplier);
  }
  
  const alternateResult = runAStar(graph, start, end);
  const routeSegments = buildRouteSegments(graph, alternateResult.path);

  if (alternateResult.distance === Infinity || alternateResult.path.length === 0) {
    return {
      originalRoute: originalResult.path,
      alternateRoute: [],
      metrics: {
        originalEta: originalResult.distance,
        newEta: Infinity,
        delta: 'N/A',
        routePreference,
        routeScore: 0,
      },
      routeSegments: [],
      liveStatus: {
        condition: 'Network Alert',
        message: 'All high-capacity links are blocked. No safe alternate path is currently available.',
      },
      aiExplanation: 'CRITICAL: All viable routes to Destination are currently blocked. Recommendation: Instruct driver to halt at nearest safe harbor and await dispatch instructions.',
    };
  }
  
  const deltaValue = alternateResult.distance - originalResult.distance;
  const metrics = {
    originalEta: originalResult.distance,
    newEta: alternateResult.distance,
    delta: deltaValue >= 0 ? `+${deltaValue.toFixed(1)} mins` : `${deltaValue.toFixed(1)} mins`,
    routePreference,
    routeScore: Math.max(0, Math.round(100 - alternateResult.distance - routeSegments.filter((segment) => segment.risk === 'High').length * 5)),
  };

  if (disruption) {
    aiExplanation = await generateRouteExplanation(originalResult.path, alternateResult.path, metrics, disruption);
  }

  return {
    originalRoute: originalResult.path,
    alternateRoute: alternateResult.path,
    metrics,
    routeSegments,
    routePreference,
    liveStatus: {
      condition: disruption ? 'Disruption-aware routing' : 'Live traffic-aware routing',
      message: disruption
        ? `Disruption on ${disruption.fromNode}→${disruption.toNode} detected. Re-routing using ${routePreference} preference.`
        : `Routing optimized with current network congestion and ${routePreference} preference.`,
    },
    aiExplanation,
  };
};
