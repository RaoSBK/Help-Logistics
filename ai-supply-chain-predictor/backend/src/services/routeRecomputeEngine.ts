import { graphManager } from './graphWeightUpdater';
import { runDijkstra } from '../algorithms/dijkstra';
import { createMockNetwork } from '../algorithms/graph';
import { generateRouteExplanation } from './explanationEngine';

let originalResultCache: any = null;

export const recomputeRoute = async (start: string, end: string, disruptionEvent?: any) => {
  const graph = graphManager.getGraph();
  
  if (!originalResultCache) {
      const baselineGraph = createMockNetwork();
      originalResultCache = runDijkstra(baselineGraph, start, end); 
  }
  
  const originalResult = originalResultCache;
  const alternateResult = runDijkstra(graph, start, end);

  let aiExplanation = 'Optimal route calculated under current network conditions.';

  if (alternateResult.distance === Infinity || alternateResult.path.length === 0) {
    return {
      originalRoute: originalResult.path,
      alternateRoute: [],
      metrics: {
        originalEta: originalResult.distance,
        newEta: Infinity,
        delta: "N/A"
      },
      aiExplanation: "CRITICAL: All viable routes to Destination are currently blocked.",
      disruptionEvent,
      graph: Array.from(graph.edges.entries()).map(([node, edges]) => ({ node, edges }))
    };
  }

  const metrics = {
    originalEta: originalResult.distance,
    newEta: alternateResult.distance,
    delta: alternateResult.distance - originalResult.distance > 0 
      ? `+${alternateResult.distance - originalResult.distance} mins` 
      : `${alternateResult.distance - originalResult.distance} mins`
  };

  if (disruptionEvent) {
    try {
        const severity = disruptionEvent.severityMultiplier || (disruptionEvent.severity === 'high' ? Infinity : 2);
        const disruption = { fromNode: disruptionEvent.from || 'A', toNode: disruptionEvent.to || 'B', severityMultiplier: severity };
        aiExplanation = await generateRouteExplanation(originalResult.path, alternateResult.path, metrics, disruption);
    } catch(e) {
        aiExplanation = `Rerouted due to ${disruptionEvent.type}. ETA penalty: ${metrics.delta}.`;
    }
  }

  return {
    originalRoute: originalResult.path,
    alternateRoute: alternateResult.path,
    metrics,
    aiExplanation,
    disruptionEvent,
    // Send edges so frontend can visualize disruption weights
    graphEdges: Array.from(graph.edges.entries()).map(([node, edges]) => ({ node, edges }))
  };
};
