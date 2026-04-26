"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectWeatherPenalty = void 0;
const graphWeightUpdater_1 = require("./graphWeightUpdater");
const injectWeatherPenalty = (from, to, multiplier) => {
    graphWeightUpdater_1.graphManager.applyWeatherPenalty(from, to, multiplier);
    return { type: 'weather', severity: multiplier > 2 ? 'high' : 'medium', message: `Severe weather from ${from} to ${to}` };
};
exports.injectWeatherPenalty = injectWeatherPenalty;
//# sourceMappingURL=weatherFeedService.js.map