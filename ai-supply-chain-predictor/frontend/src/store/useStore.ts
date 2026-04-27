import { create } from 'zustand';

export interface DashboardMetrics {
  highRiskShipments: number;
  activeShipments: number;
  routesMonitored: number;
  avgDelayMinutes: number;
  prev: {
    highRiskShipments: number;
    activeShipments: number;
    routesMonitored: number;
    avgDelayMinutes: number;
  };
}

export type NotifSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: NotifSeverity;
  timestamp: number; // Date.now()
  read: boolean;
}

interface AppState {
  riskScore: any;
  setRiskScore: (score: any) => void;
  alternateRoute: any;
  setAlternateRoute: (route: any) => void;
  etaPrediction: any;
  setEtaPrediction: (eta: any) => void;
  bottleneck: any;
  setBottleneck: (data: any) => void;
  dashboardMetrics: DashboardMetrics | null;
  setDashboardMetrics: (metrics: DashboardMetrics) => void;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  riskScore: null,
  setRiskScore: (score) => set({ riskScore: score }),
  alternateRoute: null,
  setAlternateRoute: (route) => set({ alternateRoute: route }),
  etaPrediction: null,
  setEtaPrediction: (eta) => set({ etaPrediction: eta }),
  bottleneck: null,
  setBottleneck: (data) => set({ bottleneck: data }),
  dashboardMetrics: null,
  setDashboardMetrics: (metrics) => set({ dashboardMetrics: metrics }),

  // Notifications
  notifications: [],
  unreadCount: 0,
  addNotification: (n) => {
    const newNotif: AppNotification = {
      ...n,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications].slice(0, 50), // keep latest 50
      unreadCount: state.unreadCount + 1,
    }));
  },
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clearNotification: (id) =>
    set((state) => {
      const removed = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: removed && !removed.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }),
  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  // Theme
  isDark: false,
  toggleTheme: () => {
    const next = !get().isDark;
    document.documentElement.classList.toggle('dark', next);
    set({ isDark: next });
  },
}));
