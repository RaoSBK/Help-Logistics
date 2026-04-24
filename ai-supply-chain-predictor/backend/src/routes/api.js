"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiController_1 = require("../controllers/apiController");
const router = (0, express_1.Router)();
router.post('/risk-score', apiController_1.getRiskScore);
router.post('/alternate-route', apiController_1.getAlternateRoute);
router.post('/predict-eta', apiController_1.getPredictEta);
router.post('/detect-bottleneck', apiController_1.getDetectBottleneck);
router.post('/copilot/query', apiController_1.postCopilotQuery);
exports.default = router;
//# sourceMappingURL=api.js.map