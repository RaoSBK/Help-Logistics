"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAlternateRoute = void 0;
const graph_1 = require("../algorithms/graph");
const astar_1 = require("../algorithms/astar");
const explanationEngine_1 = require("./explanationEngine");
const findAlternateRoute = async (data) => {
    const { start = 'A', end = 'D', disruption } = data || {};
    const graph = (0, graph_1.createMockNetwork)();
    // Get baseline route
    const originalResult = (0, astar_1.runAStar)(graph, start, end);
    let aiExplanation = 'Optimal route calculated under normal conditions. No disruptions detected.';
    if (disruption) {
        const { fromNode, toNode, severityMultiplier } = disruption;
        graph.applyDisruption(fromNode, toNode, severityMultiplier);
    }
    const alternateResult = (0, astar_1.runAStar)(graph, start, end);
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
        aiExplanation = await (0, explanationEngine_1.generateRouteExplanation)(originalResult.path, alternateResult.path, metrics, disruption);
    }
    return {
        originalRoute: originalResult.path,
        alternateRoute: alternateResult.path,
        metrics,
        aiExplanation
    };
};
exports.findAlternateRoute = findAlternateRoute;
//# sourceMappingURL=routingEngine.js.map