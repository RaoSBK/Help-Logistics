import { injectTrafficDelay } from './trafficFeedService';
import { injectWeatherPenalty } from './weatherFeedService';
import { graphManager } from './graphWeightUpdater';
import { broadcastRouteUpdate } from '../sockets/routeUpdates';
import { recomputeRoute } from './routeRecomputeEngine';

let intervalId: NodeJS.Timeout | null = null;

const possibleEvents = [
  { type: 'traffic', from: 'A', to: 'B', penalty: 5 },
  { type: 'traffic', from: 'C', to: 'D', penalty: Infinity }, // Closure
  { type: 'weather', from: 'B', to: 'C', penalty: 3 },
  { type: 'traffic', from: 'B', to: 'D', penalty: Infinity }, // Closure
  { type: 'reset' } // Reset weights back to normal
];

export const startDisruptionEngine = (start: string, end: string) => {
  if (intervalId) return;

  console.log('Starting live disruption engine...');

  intervalId = setInterval(async () => {
    const eventTemplate = possibleEvents[Math.floor(Math.random() * possibleEvents.length)]!;
    let eventInfo: any = null;

    if (eventTemplate.type === 'reset') {
      graphManager.resetWeights();
      eventInfo = { type: 'recovery', severity: 'low', message: 'Conditions normalized.' };
    } else if (eventTemplate.type === 'traffic') {
      eventInfo = injectTrafficDelay(eventTemplate.from!, eventTemplate.to!, eventTemplate.penalty!);
      eventInfo.from = eventTemplate.from;
      eventInfo.to = eventTemplate.to;
    } else if (eventTemplate.type === 'weather') {
      eventInfo = injectWeatherPenalty(eventTemplate.from!, eventTemplate.to!, eventTemplate.penalty!);
      eventInfo.from = eventTemplate.from;
      eventInfo.to = eventTemplate.to;
    }

    const routeUpdate = await recomputeRoute(start, end, eventInfo);
    broadcastRouteUpdate(routeUpdate);

  }, 5000);
};

export const stopDisruptionEngine = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Stopped live disruption engine.');
  }
};
