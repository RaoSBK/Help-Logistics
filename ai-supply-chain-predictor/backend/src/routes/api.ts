import { Router } from 'express';
import {
  getRiskScore,
  getAlternateRoute,
  getPredictEta,
  getDetectBottleneck,
  postCopilotQuery
} from '../controllers/apiController';

const router = Router();

router.post('/risk-score', getRiskScore);
router.post('/alternate-route', getAlternateRoute);
router.post('/predict-eta', getPredictEta);
router.post('/detect-bottleneck', getDetectBottleneck);
router.post('/copilot/query', postCopilotQuery);

export default router;
