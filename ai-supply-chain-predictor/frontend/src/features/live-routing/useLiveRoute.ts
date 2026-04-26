import { useState, useEffect } from 'react';
import { socket } from './routeSocketClient';

export interface RouteUpdate {
  originalRoute: string[];
  alternateRoute: string[];
  metrics: {
    originalEta: number;
    newEta: number;
    delta: string;
  };
  aiExplanation: string;
  disruptionEvent?: any;
  graphEdges?: {node: string, edges: any[]}[];
  riskScore?: {
    score: number;
    level: 'Low' | 'Medium' | 'High';
    explanation: string;
  };
}

export const useLiveRoute = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [routeData, setRouteData] = useState<RouteUpdate | null>(null);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setIsSimulating(false);
    });

    socket.on('initial_route', (data: RouteUpdate) => {
      setRouteData(data);
    });

    socket.on('route_update', (data: RouteUpdate) => {
      setRouteData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startSimulation = () => {
    socket.emit('start_simulation', { start: 'A', end: 'D' });
    setIsSimulating(true);
  };

  const stopSimulation = () => {
    socket.emit('stop_simulation');
    setIsSimulating(false);
  };

  return {
    isConnected,
    isSimulating,
    routeData,
    startSimulation,
    stopSimulation
  };
};
