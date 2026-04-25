import { graphManager } from './graphWeightUpdater';

export const injectWeatherPenalty = (from: string, to: string, multiplier: number) => {
  graphManager.applyWeatherPenalty(from, to, multiplier);
  return { type: 'weather', severity: multiplier > 2 ? 'high' : 'medium', message: `Severe weather from ${from} to ${to}` };
};
