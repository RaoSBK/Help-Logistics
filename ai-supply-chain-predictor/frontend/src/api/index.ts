import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
});

export const requestRiskScore = (data: any) => api.post('/risk-score', data).then(res => res.data);
export const requestAlternateRoute = (data: any) => api.post('/alternate-route', data).then(res => res.data);
export const requestPredictEta = (data: any) => api.post('/predict-eta', data).then(res => res.data);
export const requestDetectBottleneck = (data: any) => api.post('/detect-bottleneck', data).then(res => res.data);
export const requestCopilotQuery = (data: any) => api.post('/copilot/query', data).then(res => res.data);
