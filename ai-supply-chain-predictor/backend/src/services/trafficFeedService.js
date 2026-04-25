"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectTrafficDelay = void 0;
const graphWeightUpdater_1 = require("./graphWeightUpdater");
const injectTrafficDelay = (from, to, multiplier) => {
    graphWeightUpdater_1.graphManager.applyTrafficDelay(from, to, multiplier);
    return { type: 'traffic', severity: multiplier > 2 ? 'high' : 'medium', message: `Traffic delay detected from ${from} to ${to}` };
};
exports.injectTrafficDelay = injectTrafficDelay;
//# sourceMappingURL=trafficFeedService.js.map