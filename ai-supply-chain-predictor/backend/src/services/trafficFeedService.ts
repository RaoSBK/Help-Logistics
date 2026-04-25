import { graphManager } from './graphWeightUpdater';

export const injectTrafficDelay = (from: string, to: string, multiplier: number) => {
  graphManager.applyTrafficDelay(from, to, multiplier);
  return { type: 'traffic', severity: multiplier > 2 ? 'high' : 'medium', message: `Traffic delay detected from ${from} to ${to}` };
};
