"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopDisruptionEngine = exports.startDisruptionEngine = void 0;
const trafficFeedService_1 = require("./trafficFeedService");
const weatherFeedService_1 = require("./weatherFeedService");
const graphWeightUpdater_1 = require("./graphWeightUpdater");
const routeUpdates_1 = require("../sockets/routeUpdates");
const routeRecomputeEngine_1 = require("./routeRecomputeEngine");
let intervalId = null;
const possibleEvents = [
    { type: 'traffic', from: 'A', to: 'B', penalty: 5 },
    { type: 'traffic', from: 'C', to: 'D', penalty: Infinity }, // Closure
    { type: 'weather', from: 'B', to: 'C', penalty: 3 },
    { type: 'traffic', from: 'B', to: 'D', penalty: Infinity }, // Closure
    { type: 'reset' } // Reset weights back to normal
];
const startDisruptionEngine = (start, end) => {
    if (intervalId)
        return;
    console.log('Starting live disruption engine...');
    intervalId = setInterval(async () => {
        const eventTemplate = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        let eventInfo = null;
        if (eventTemplate.type === 'reset') {
            graphWeightUpdater_1.graphManager.resetWeights();
            eventInfo = { type: 'recovery', severity: 'low', message: 'Conditions normalized.' };
        }
        else if (eventTemplate.type === 'traffic') {
            eventInfo = (0, trafficFeedService_1.injectTrafficDelay)(eventTemplate.from, eventTemplate.to, eventTemplate.penalty);
            eventInfo.from = eventTemplate.from;
            eventInfo.to = eventTemplate.to;
        }
        else if (eventTemplate.type === 'weather') {
            eventInfo = (0, weatherFeedService_1.injectWeatherPenalty)(eventTemplate.from, eventTemplate.to, eventTemplate.penalty);
            eventInfo.from = eventTemplate.from;
            eventInfo.to = eventTemplate.to;
        }
        const routeUpdate = await (0, routeRecomputeEngine_1.recomputeRoute)(start, end, eventInfo);
        (0, routeUpdates_1.broadcastRouteUpdate)(routeUpdate);
    }, 5000);
};
exports.startDisruptionEngine = startDisruptionEngine;
const stopDisruptionEngine = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('Stopped live disruption engine.');
    }
};
exports.stopDisruptionEngine = stopDisruptionEngine;
//# sourceMappingURL=disruptionEngine.js.map