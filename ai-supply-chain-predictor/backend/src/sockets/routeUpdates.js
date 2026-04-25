"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastRouteUpdate = exports.initSockets = void 0;
const socket_io_1 = require("socket.io");
const disruptionEngine_1 = require("../services/disruptionEngine");
const routeRecomputeEngine_1 = require("../services/routeRecomputeEngine");
let io;
const initSockets = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // For development
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', async (socket) => {
        console.log(`Client connected: ${socket.id}`);
        // Send initial route based on normal weights
        const initialRoute = await (0, routeRecomputeEngine_1.recomputeRoute)('A', 'D');
        socket.emit('initial_route', initialRoute);
        socket.on('start_simulation', (data) => {
            const { start = 'A', end = 'D' } = data || {};
            (0, disruptionEngine_1.startDisruptionEngine)(start, end);
        });
        socket.on('stop_simulation', () => {
            (0, disruptionEngine_1.stopDisruptionEngine)();
        });
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};
exports.initSockets = initSockets;
const broadcastRouteUpdate = (update) => {
    if (io) {
        io.emit('route_update', update);
    }
};
exports.broadcastRouteUpdate = broadcastRouteUpdate;
//# sourceMappingURL=routeUpdates.js.map