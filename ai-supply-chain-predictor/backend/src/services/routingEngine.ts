import { createMockNetwork } from '../algorithms/graph';
import { runAStar } from '../algorithms/astar';
import { generateRouteExplanation } from './explanationEngine';

export const findAlternateRoute = async (data: any) => {
  const { start = 'A', end = 'D', disruption } = data || {};
  
  const graph = createMockNetwork();
  
  // Get baseline route
  const originalResult = runAStar(graph, start, end);
  
  let aiExplanation = 'Optimal route calculated under normal conditions. No disruptions detected.';
  
  if (disruption) {
    const { fromNode, toNode, severityMultiplier } = disruption;
    graph.applyDisruption(fromNode, toNode, severityMultiplier);
  }
  
  const alternateResult = runAStar(graph, start, end);

  // EDGE CASE: No viable path exists
  if (alternateResult.distance === Infinity || alternateResult.path.length === 0) {
    return {
      originalRoute: originalResult.path,
      alternateRoute: [],
      metrics: {
        originalEta: originalResult.distance,
        newEta: Infinity,
        delta: "N/A"
      },
      aiExplanation: "CRITICAL: All viable routes to Destination are currently blocked. Recommendation: Instruct driver to halt at nearest safe harbor and await dispatch instructions."
    };
  }
  
  const metrics = {
    originalEta: originalResult.distance,
    newEta: alternateResult.distance,
    delta: alternateResult.distance - originalResult.distance > 0 
      ? `+${alternateResult.distance - originalResult.distance} mins` 
      : `${alternateResult.distance - originalResult.distance} mins`
  };

  if (disruption) {
    aiExplanation = await generateRouteExplanation(originalResult.path, alternateResult.path, metrics, disruption);
  }
  
  return {
    originalRoute: originalResult.path,
    alternateRoute: alternateResult.path,
    metrics,
    aiExplanation
  };
};
