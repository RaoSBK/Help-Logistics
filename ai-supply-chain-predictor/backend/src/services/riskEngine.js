"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRiskScore = void 0;
const geminiClient_1 = require("../ai/geminiClient");
const calculateRiskScore = async (data) => {
    // Mock logic: predict shipment route risk using traffic, weather inputs
    const score = Math.floor(Math.random() * 50) + 20; // 20-70
    const explanation = await (0, geminiClient_1.generateContent)(`Explain risk for shipment ${JSON.stringify(data)}`);
    return {
        score,
        level: score > 60 ? 'High' : score > 30 ? 'Medium' : 'Low',
        explanation
    };
};
exports.calculateRiskScore = calculateRiskScore;
//# sourceMappingURL=riskEngine.js.map