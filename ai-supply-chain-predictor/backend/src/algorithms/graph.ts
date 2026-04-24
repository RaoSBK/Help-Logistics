export interface Coordinate {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  name: string;
  coords: Coordinate;
}

export interface Edge {
  from: string;
  to: string;
  weight: number; // Base travel time
  disruptionMultiplier: number; // 1 = normal. Infinity = closed
}

export class Graph {
  nodes: Map<string, Node> = new Map();
  edges: Map<string, Edge[]> = new Map();

  addNode(node: Node) {
    this.nodes.set(node.id, node);
    this.edges.set(node.id, []);
  }

  addEdge(edge: Edge) {
    this.edges.get(edge.from)?.push(edge);
  }

  getNeighbors(nodeId: string): Edge[] {
    return this.edges.get(nodeId) || [];
  }

  getNode(nodeId: string): Node | undefined {
    return this.nodes.get(nodeId);
  }

  applyDisruption(from: string, to: string, multiplier: number) {
    const fromEdges = this.edges.get(from);
    if (fromEdges) {
      const edge = fromEdges.find(e => e.to === to);
      if (edge) {
        edge.disruptionMultiplier = multiplier;
      }
    }
  }
}

export const createMockNetwork = (): Graph => {
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
