"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCopilotQuery = exports.getDetectBottleneck = exports.getPredictEta = exports.getAlternateRoute = exports.getRiskScore = void 0;
const express_1 = require("express");
const riskEngine_1 = require("../services/riskEngine");
const routingEngine_1 = require("../services/routingEngine");
const etaEngine_1 = require("../services/etaEngine");
const congestionEngine_1 = require("../services/congestionEngine");
const copilotEngine_1 = require("../services/copilotEngine");
const getRiskScore = async (req, res) => {
    try {
        const result = await (0, riskEngine_1.calculateRiskScore)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to calculate risk score' });
    }
};
exports.getRiskScore = getRiskScore;
const getAlternateRoute = async (req, res) => {
    try {
        const result = await (0, routingEngine_1.findAlternateRoute)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to find alternate route' });
    }
};
exports.getAlternateRoute = getAlternateRoute;
const getPredictEta = async (req, res) => {
    try {
        const result = await (0, etaEngine_1.predictEta)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to predict ETA' });
    }
};
exports.getPredictEta = getPredictEta;
const getDetectBottleneck = async (req, res) => {
    try {
        const result = await (0, congestionEngine_1.detectCongestion)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to detect bottleneck' });
    }
};
exports.getDetectBottleneck = getDetectBottleneck;
const postCopilotQuery = async (req, res) => {
    try {
        const result = await (0, copilotEngine_1.queryCopilot)(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to query copilot' });
    }
};
exports.postCopilotQuery = postCopilotQuery;
//# sourceMappingURL=apiController.js.map