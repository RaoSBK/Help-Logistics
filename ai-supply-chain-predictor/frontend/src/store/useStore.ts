import { create } from 'zustand';

interface AppState {
  riskScore: any;
  setRiskScore: (score: any) => void;
  alternateRoute: any;
  setAlternateRoute: (route: any) => void;
  etaPrediction: any;
  setEtaPrediction: (eta: any) => void;
  bottleneck: any;
  setBottleneck: (data: any) => void;
}

export const useStore = create<AppState>((set) => ({
  riskScore: null,
  setRiskScore: (score) => set({ riskScore: score }),
  alternateRoute: null,
  setAlternateRoute: (route) => set({ alternateRoute: route }),
  etaPrediction: null,
  setEtaPrediction: (eta) => set({ etaPrediction: eta }),
  bottleneck: null,
  setBottleneck: (data) => set({ bottleneck: data })
}));
