"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryCopilot = void 0;
const geminiClient_1 = require("../ai/geminiClient");
const queryCopilot = async (data) => {
    const { query, shipmentDetails } = data;
    const context = `Shipment details: ${JSON.stringify(shipmentDetails)}. User query: ${query}`;
    const response = await (0, geminiClient_1.generateContent)(context);
    return {
        response,
        suggestedActions: ['Reroute to Route C', 'Notify Customer of Delay']
    };
};
exports.queryCopilot = queryCopilot;
//# sourceMappingURL=copilotEngine.js.map