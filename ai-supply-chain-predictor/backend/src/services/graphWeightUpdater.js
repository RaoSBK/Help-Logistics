"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphManager = void 0;
const graph_1 = require("../algorithms/graph");
class GraphWeightUpdater {
    graph;
    constructor() {
        this.graph = (0, graph_1.createMockNetwork)();
    }
    getGraph() {
        return this.graph;
    }
    applyTrafficDelay(from, to, penalty) {
        const edges = this.graph.getNeighbors(from);
        const edge = edges.find(e => e.to === to);
        if (edge) {
            edge.disruptionMultiplier = penalty;
        }
    }
    applyWeatherPenalty(from, to, penalty) {
        const edges = this.graph.getNeighbors(from);
        const edge = edges.find(e => e.to === to);
        if (edge) {
            edge.disruptionMultiplier = penalty;
        }
    }
    applyClosure(from, to) {
        const edges = this.graph.getNeighbors(from);
        const edge = edges.find(e => e.to === to);
        if (edge) {
            edge.disruptionMultiplier = Infinity;
        }
    }
    resetWeights() {
        this.graph = (0, graph_1.createMockNetwork)();
    }
}
exports.graphManager = new GraphWeightUpdater();
//# sourceMappingURL=graphWeightUpdater.js.map