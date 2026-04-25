import { Graph, Node, Edge } from './graph';

export interface PathResult {
  path: string[];
  distance: number;
}

export const runDijkstra = (graph: Graph, startId: string, endId: string): PathResult => {
  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  // Initialize
  for (const [nodeId] of graph.nodes) {
    distances.set(nodeId, Infinity);
    previous.set(nodeId, null);
    unvisited.add(nodeId);
  }
  
  distances.set(startId, 0);

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      const dist = distances.get(nodeId)!;
      if (dist < minDistance) {
        minDistance = dist;
        currentId = nodeId;
      }
    }

    if (currentId === null || minDistance === Infinity) {
      break; // No reachable unvisited nodes left
    }

    if (currentId === endId) {
      break; // Reached destination
    }

    unvisited.delete(currentId);

    const neighbors = graph.getNeighbors(currentId);
    for (const edge of neighbors) {
      if (!unvisited.has(edge.to)) continue;

      // Effective weight considers disruption multipliers
      const effectiveWeight = edge.weight * edge.disruptionMultiplier;
      const alt = distances.get(currentId)! + effectiveWeight;

      if (alt < distances.get(edge.to)!) {
        distances.set(edge.to, alt);
        previous.set(edge.to, currentId);
      }
    }
  }

  // Build path
  const path: string[] = [];
  let current: string | null = endId;
  
  if (previous.get(endId) !== null || startId === endId) {
    while (current !== null) {
      path.unshift(current);
      current = previous.get(current)!;
    }
  }

  return {
    path: distances.get(endId) === Infinity ? [] : path,
    distance: distances.get(endId)!
  };
};
