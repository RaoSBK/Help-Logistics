import { generateContent } from '../ai/geminiClient';

export interface RouteMetrics {
  originalEta: number;
  newEta: number;
  delta: string;
}

export const generateRouteExplanation = async (
  originalRoute: string[],
  newRoute: string[],
  metrics: RouteMetrics,
  disruptionInfo?: any
): Promise<string> => {
  const prompt = `
    The user was originally going via path: ${originalRoute.join(' -> ')} (ETA: ${metrics.originalEta} mins).
    A disruption was detected. The system rerouted via: ${newRoute.join(' -> ')} (ETA: ${metrics.newEta} mins).
    Explain this routing decision to the dispatcher in 2 clear sentences. Mention the time difference (${metrics.delta}).
  `;
  
  const reasoning = await generateContent(prompt);
  return reasoning;
};
