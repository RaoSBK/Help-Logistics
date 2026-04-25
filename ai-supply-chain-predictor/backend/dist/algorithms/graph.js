"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockNetwork = exports.Graph = void 0;
class Graph {
    nodes = new Map();
    edges = new Map();
    addNode(node) {
        this.nodes.set(node.id, node);
        this.edges.set(node.id, []);
    }
    addEdge(edge) {
        this.edges.get(edge.from)?.push(edge);
    }
    getNeighbors(nodeId) {
        return this.edges.get(nodeId) || [];
    }
    getNode(nodeId) {
        return this.nodes.get(nodeId);
    }
    applyDisruption(from, to, multiplier) {
        const fromEdges = this.edges.get(from);
        if (fromEdges) {
            const edge = fromEdges.find(e => e.to === to);
            if (edge) {
                edge.disruptionMultiplier = multiplier;
            }
        }
    }
}
exports.Graph = Graph;
const createMockNetwork = () => {
    const graph = new Graph();
    // Add Nodes
    graph.addNode({ id: 'A', name: 'Origin Facility', coords: { x: 0, y: 0 } });
    graph.addNode({ id: 'B', name: 'Highway Checkpoint 1', coords: { x: 10, y: 0 } });
    graph.addNode({ id: 'C', name: 'Mountain Pass', coords: { x: 5, y: 10 } });
    graph.addNode({ id: 'D', name: 'Destination Port', coords: { x: 20, y: 0 } });
    graph.addNode({ id: 'E', name: 'Valley Route', coords: { x: 15, y: 10 } });
    // Add Edges
    graph.addEdge({ from: 'A', to: 'B', weight: 10, disruptionMultiplier: 1 });
    graph.addEdge({ from: 'A', to: 'C', weight: 15, disruptionMultiplier: 1 });
    graph.addEdge({ from: 'B', to: 'D', weight: 10, disruptionMultiplier: 1 });
    graph.addEdge({ from: 'B', to: 'C', weight: 10, disruptionMultiplier: 1 });
    graph.addEdge({ from: 'C', to: 'D', weight: 20, disruptionMultiplier: 1 });
    graph.addEdge({ from: 'C', to: 'E', weight: 10, disruptionMultiplier: 1 });
    graph.addEdge({ from: 'E', to: 'D', weight: 10, disruptionMultiplier: 1 });
    return graph;
};
exports.createMockNetwork = createMockNetwork;
//# sourceMappingURL=graph.js.map