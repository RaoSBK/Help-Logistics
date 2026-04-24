import { Graph, Node } from './graph';

export interface AStarResult {
  path: string[];
  distance: number;
}

const heuristic = (nodeA: Node, nodeB: Node): number => {
  const dx = nodeA.coords.x - nodeB.coords.x;
  const dy = nodeA.coords.y - nodeB.coords.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const runAStar = (graph: Graph, startId: string, endId: string): AStarResult => {
  const startNode = graph.getNode(startId);
  const endNode = graph.getNode(endId);

  if (!startNode || !endNode) {
    throw new Error('Start or end node not found in graph');
  }

  const openSet = new Set<string>([startId]);
  const cameFrom = new Map<string, string>();
  
  const gScore = new Map<string, number>();
  gScore.set(startId, 0);

  const fScore = new Map<string, number>();
  fScore.set(startId, heuristic(startNode, endNode));

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let currentId = '';
    let lowestFScore = Infinity;
    
    for (const id of openSet) {
      const score = fScore.get(id) ?? Infinity;
      if (score < lowestFScore) {
        lowestFScore = score;
        currentId = id;
      }
    }

    if (currentId === endId) {
      return reconstructPath(cameFrom, currentId, gScore.get(currentId) || 0);
    }

    openSet.delete(currentId);
    
    const currentNode = graph.getNode(currentId)!;
    const neighbors = graph.getNeighbors(currentId);

    for (const edge of neighbors) {
      const neighborId = edge.to;
      const effectiveWeight = edge.weight * edge.disruptionMultiplier;
      
      const tentativeGScore = (gScore.get(currentId) ?? Infinity) + effectiveWeight;

      if (tentativeGScore < (gScore.get(neighborId) ?? Infinity)) {
        cameFrom.set(neighborId, currentId);
        gScore.set(neighborId, tentativeGScore);
        
        const neighborNode = graph.getNode(neighborId)!;
        fScore.set(neighborId, tentativeGScore + heuristic(neighborNode, endNode));

        if (!openSet.has(neighborId)) {
          openSet.add(neighborId);
        }
      }
    }
  }

  // No path found
  return { path: [], distance: Infinity };
};

const reconstructPath = (cameFrom: Map<string, string>, currentId: string, totalDistance: number): AStarResult => {
  const path = [currentId];
  let curr = currentId;
  while (cameFrom.has(curr)) {
    curr = cameFrom.get(curr)!;
    path.unshift(curr);
  }
  return { path, distance: totalDistance };
};
