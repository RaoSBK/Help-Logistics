import { Request, Response } from 'express';
import { calculateRiskScore } from '../services/riskEngine';
import { findAlternateRoute } from '../services/routingEngine';
import { predictEta } from '../services/etaEngine';
import { detectCongestion } from '../services/congestionEngine';
import { queryCopilot } from '../services/copilotEngine';

export const getRiskScore = async (req: Request, res: Response) => {
  try {
    const result = await calculateRiskScore(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate risk score' });
  }
};

export const getAlternateRoute = async (req: Request, res: Response) => {
  try {
    const result = await findAlternateRoute(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to find alternate route' });
  }
};

export const getPredictEta = async (req: Request, res: Response) => {
  try {
    const result = await predictEta(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to predict ETA' });
  }
};

export const getDetectBottleneck = async (req: Request, res: Response) => {
  try {
    const result = await detectCongestion(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to detect bottleneck' });
  }
};

export const postCopilotQuery = async (req: Request, res: Response) => {
  try {
    const result = await queryCopilot(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query copilot' });
  }
};
