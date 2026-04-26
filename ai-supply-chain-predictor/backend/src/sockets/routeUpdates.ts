import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { startDisruptionEngine, stopDisruptionEngine, triggerDisruption } from '../services/disruptionEngine';
import { recomputeRoute } from '../services/routeRecomputeEngine';
import { eventBus, EVENTS } from '../services/eventBus';

let io: Server;

export const initSockets = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For development
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', async (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Send initial route based on normal weights
    const initialRoute = await recomputeRoute('A', 'D');
    socket.emit('initial_route', initialRoute);

    // Auto-start simulation so numbers are always live
    startDisruptionEngine('A', 'D');

    socket.on('start_simulation', (data) => {
      const { start = 'A', end = 'D' } = data || {};
      startDisruptionEngine(start, end);
    });

    socket.on('stop_simulation', () => {
      stopDisruptionEngine();
    });

    socket.on('request_refresh', () => {
      triggerDisruption('A', 'D');
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

export const broadcastRouteUpdate = (update: any) => {
  if (io) {
    io.emit('route_update', update);
  }
};

eventBus.on(EVENTS.ROUTE_RECOMPUTED, (update) => {
  console.log('Broadcasting route update to clients from event bus');
  broadcastRouteUpdate(update);
});
