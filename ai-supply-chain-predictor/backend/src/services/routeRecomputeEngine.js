"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recomputeRoute = void 0;
const graphWeightUpdater_1 = require("./graphWeightUpdater");
const dijkstra_1 = require("../algorithms/dijkstra");
const graph_1 = require("../algorithms/graph");
const explanationEngine_1 = require("./explanationEngine");
let originalResultCache = null;
const recomputeRoute = async (start, end, disruptionEvent) => {
    const graph = graphWeightUpdater_1.graphManager.getGraph();
    if (!originalResultCache) {
        const baselineGraph = (0, graph_1.createMockNetwork)();
        originalResultCache = (0, dijkstra_1.runDijkstra)(baselineGraph, start, end);
    }
    const originalResult = originalResultCache;
    const alternateResult = (0, dijkstra_1.runDijkstra)(graph, start, end);
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
            aiExplanation = await (0, explanationEngine_1.generateRouteExplanation)(originalResult.path, alternateResult.path, metrics, disruption);
        }
        catch (e) {
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
exports.recomputeRoute = recomputeRoute;
//# sourceMappingURL=routeRecomputeEngine.js.map