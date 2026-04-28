import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Clock, RefreshCw } from 'lucide-react';

export default function EtaPanel() {
  const [eta, setEta] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Create a dedicated socket connection for ETA data
    const etaSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001');
    socketRef.current = etaSocket;

    const handleData = (data: any) => {
      if (data && data.eta) {
        setEta(data.eta);
      }
    };

    etaSocket.on('initial_route', handleData);
    etaSocket.on('route_update', handleData);

    // Auto-refresh every 12 seconds
    const intervalId = setInterval(() => {
      etaSocket.emit('request_refresh');
    }, 12000);

    return () => {
      clearInterval(intervalId);
      etaSocket.off('initial_route', handleData);
      etaSocket.off('route_update', handleData);
      etaSocket.disconnect();
    };
  }, []);

  const formatHoursMins = (minutes: number) => {
    if (minutes === undefined || minutes === null || isNaN(minutes)) return '0h 0m';
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
  };

  const formatArrivalDate = (isoString?: string) => {
    if (!isoString) return 'Arrival Invalid Date';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Arrival Invalid Date';
    return `Arrival ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (socketRef.current) {
      socketRef.current.emit('request_refresh');
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const total = eta ? eta.totalEtaMinutes : 100;
  const getWidth = (val: number) => eta ? `${(val / total) * 100}%` : '0%';

  return (
    <div className="glass-panel h-full flex flex-col justify-between font-sans">
      <div className="mb-5 flex justify-between items-center">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Clock className="text-blue-500" size={16} />
          Predictive ETA Offset
        </h2>
      </div>

      <div className="space-y-4 flex-1">
        {/* Top Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 uppercase font-semibold tracking-wider">Base Travel Time</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{eta ? formatHoursMins(eta.breakdown.base) : '0h 0m'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Base route duration</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-500/15 p-4 rounded-lg border border-blue-200 dark:border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)] relative">
            <p className="text-[10px] text-blue-600 dark:text-blue-400 mb-1 uppercase font-semibold tracking-wider">AI Adjusted ETA</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">{eta ? formatHoursMins(eta.totalEtaMinutes) : '0h 0m'}</p>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80">{eta ? formatArrivalDate(eta.estimatedArrival) : 'Arrival Invalid Date'}</p>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 uppercase font-semibold tracking-wider">Traffic Delay</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{eta ? formatHoursMins(eta.breakdown.trafficDelay) : '0h 0m'}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 uppercase font-semibold tracking-wider">Weather Delay</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{eta ? formatHoursMins(eta.breakdown.weatherDelay) : '0h 0m'}</p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 uppercase font-semibold tracking-wider">Congestion</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{eta ? formatHoursMins(eta.breakdown.congestion) : '0h 0m'}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 uppercase font-semibold tracking-wider">Risk Buffer</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{eta ? formatHoursMins(eta.breakdown.riskBuffer) : '0h 0m'}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-500/15 p-3 rounded-lg border border-blue-200 dark:border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <p className="text-[10px] text-blue-600 dark:text-blue-400 mb-1 uppercase font-semibold tracking-wider">Confidence</p>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{eta ? `${eta.confidence}%` : '0%'}</p>
          </div>
        </div>

        {/* ETA Breakdown Bar */}
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600 mt-4 shadow-sm">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider mb-3">ETA Breakdown</p>
          
          <div className="h-3 w-full rounded-full flex overflow-hidden mb-3">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: getWidth(eta?.breakdown.base || 0) }}></div>
            <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: getWidth(eta?.breakdown.trafficDelay || 0) }}></div>
            <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: getWidth(eta?.breakdown.weatherDelay || 0) }}></div>
            <div className="h-full bg-red-500 transition-all duration-500" style={{ width: getWidth(eta?.breakdown.congestion || 0) }}></div>
            <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: getWidth(eta?.breakdown.riskBuffer || 0) }}></div>
          </div>

          <div className="flex justify-between text-[10px] font-bold tracking-wider">
            <span className="text-blue-500 uppercase">Base</span>
            <span className="text-orange-500 uppercase">Traffic</span>
            <span className="text-cyan-400 uppercase">Weather</span>
            <span className="text-red-500 uppercase">Hub</span>
            <span className="text-purple-500 uppercase">Risk</span>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border-l-4 border-l-blue-500 border border-slate-200 dark:border-slate-600 shadow-sm min-h-[72px]">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed min-h-[40px]">
            {eta ? eta.explanation : 'Waiting for network data...'}
          </p>
        </div>
      </div>

      <div className="text-center pt-6 mt-auto">
        <button onClick={handleRefresh} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center justify-center gap-1.5 mx-auto bg-blue-50 dark:bg-blue-500/15 hover:bg-blue-100 dark:hover:bg-blue-500/25 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-500/30 cursor-pointer">
          <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} /> 
          {isRefreshing ? 'Refreshing...' : 'Refresh Live Data'}
        </button>
      </div>
    </div>
  );
}
