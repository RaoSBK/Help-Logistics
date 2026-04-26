import { EventEmitter } from 'events';

class EventBus extends EventEmitter {}

export const eventBus = new EventBus();

export const EVENTS = {
  TRAFFIC_UPDATED: 'TRAFFIC_UPDATED',
  WEATHER_UPDATED: 'WEATHER_UPDATED',
  DISRUPTION_DETECTED: 'DISRUPTION_DETECTED',
  ROUTE_RECOMPUTED: 'ROUTE_RECOMPUTED'
};
