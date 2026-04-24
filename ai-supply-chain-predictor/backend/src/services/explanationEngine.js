"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRouteExplanation = void 0;
const geminiClient_1 = require("../ai/geminiClient");
const generateRouteExplanation = async (originalRoute, newRoute, metrics, disruptionInfo) => {
    const prompt = `
    The user was originally going via path: ${originalRoute.join(' -> ')} (ETA: ${metrics.originalEta} mins).
    A disruption was detected. The system rerouted via: ${newRoute.join(' -> ')} (ETA: ${metrics.newEta} mins).
    Explain this routing decision to the dispatcher in 2 clear sentences. Mention the time difference (${metrics.delta}).
  `;
    const reasoning = await (0, geminiClient_1.generateContent)(prompt);
    return reasoning;
};
exports.generateRouteExplanation = generateRouteExplanation;
//# sourceMappingURL=explanationEngine.js.map