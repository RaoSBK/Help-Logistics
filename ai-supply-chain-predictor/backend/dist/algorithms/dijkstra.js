"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDijkstra = void 0;
const runDijkstra = (graph, startId, endId) => {
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    // Initialize
    for (const [nodeId] of graph.nodes) {
        distances.set(nodeId, Infinity);
        previous.set(nodeId, null);
        unvisited.add(nodeId);
    }
    distances.set(startId, 0);
    while (unvisited.size > 0) {
        // Find node with minimum distance
        let currentId = null;
        let minDistance = Infinity;
        for (const nodeId of unvisited) {
            const dist = distances.get(nodeId);
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
            if (!unvisited.has(edge.to))
                continue;
            // Effective weight considers disruption multipliers
            const effectiveWeight = edge.weight * edge.disruptionMultiplier;
            const alt = distances.get(currentId) + effectiveWeight;
            if (alt < distances.get(edge.to)) {
                distances.set(edge.to, alt);
                previous.set(edge.to, currentId);
            }
        }
    }
    // Build path
    const path = [];
    let current = endId;
    if (previous.get(endId) !== null || startId === endId) {
        while (current !== null) {
            path.unshift(current);
            current = previous.get(current);
        }
    }
    return {
        path: distances.get(endId) === Infinity ? [] : path,
        distance: distances.get(endId)
    };
};
exports.runDijkstra = runDijkstra;
//# sourceMappingURL=dijkstra.js.map