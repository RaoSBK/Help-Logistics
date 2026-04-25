import { createMockNetwork, Graph } from '../algorithms/graph';

class GraphWeightUpdater {
  private graph: Graph;

  constructor() {
    this.graph = createMockNetwork();
  }

  getGraph(): Graph {
    return this.graph;
  }

  applyTrafficDelay(from: string, to: string, penalty: number) {
    const edges = this.graph.getNeighbors(from);
    const edge = edges.find(e => e.to === to);
    if (edge) {
      edge.disruptionMultiplier = penalty;
    }
  }

  applyWeatherPenalty(from: string, to: string, penalty: number) {
    const edges = this.graph.getNeighbors(from);
    const edge = edges.find(e => e.to === to);
    if (edge) {
      edge.disruptionMultiplier = penalty;
    }
  }

  applyClosure(from: string, to: string) {
    const edges = this.graph.getNeighbors(from);
    const edge = edges.find(e => e.to === to);
    if (edge) {
      edge.disruptionMultiplier = Infinity;
    }
  }

  resetWeights() {
    this.graph = createMockNetwork();
  }
}

export const graphManager = new GraphWeightUpdater();
