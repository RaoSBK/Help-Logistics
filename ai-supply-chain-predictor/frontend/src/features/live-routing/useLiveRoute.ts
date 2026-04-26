import { useState, useEffect } from 'react';
import { socket } from './routeSocketClient';
import { useStore } from '../../store/useStore';

export interface RouteUpdate {
  originalRoute: string[];
  alternateRoute: string[];
  metrics: {
    originalEta: number;
    newEta: number;
    delta: string;
  };
  eta?: {
    totalEtaMinutes: number;
    breakdown: {
      base: number;
      trafficDelay: number;
      weatherDelay: number;
      congestion: number;
      riskBuffer: number;
    };
    confidence: number;
    estimatedArrival: string;
    explanation: string;
  };
  aiExplanation: string;
  disruptionEvent?: any;
  graphEdges?: {node: string, edges: any[]}[];
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
      if (data.eta) useStore.getState().setEtaPrediction(data.eta);
    });

    socket.on('route_update', (data: RouteUpdate) => {
      setRouteData(data);
      if (data.eta) useStore.getState().setEtaPrediction(data.eta);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('initial_route');
      socket.off('route_update');
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
