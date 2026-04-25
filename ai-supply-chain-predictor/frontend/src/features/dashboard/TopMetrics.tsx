import { ShieldAlert, Truck, Map, Clock } from 'lucide-react';

export default function TopMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-8 mb-6">
      
      {/* High Risk Shipments */}
      <div className="glass-panel flex items-center gap-4 p-5">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
          <ShieldAlert size={24} />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">High Risk Shipments</div>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">7</div>
          <div className="text-xs font-medium text-red-500 mt-1 flex items-center gap-1">
            ↑ 12% <span className="text-slate-400 font-normal">vs yesterday</span>
          </div>
        </div>
      </div>

      {/* Active Shipments */}
      <div className="glass-panel flex items-center gap-4 p-5">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
          <Truck size={24} />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Active Shipments</div>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">128</div>
          <div className="text-xs font-medium text-emerald-500 mt-1 flex items-center gap-1">
            ↑ 8% <span className="text-slate-400 font-normal">vs yesterday</span>
          </div>
        </div>
      </div>

      {/* Routes Monitored */}
      <div className="glass-panel flex items-center gap-4 p-5">
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
          <Map size={24} />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Routes Monitored</div>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">64</div>
          <div className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1">
            — No change
          </div>
        </div>
      </div>

      {/* Avg Delay */}
      <div className="glass-panel flex items-center gap-4 p-5">
        <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
          <Clock size={24} />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase">Avg. Delay (ETA)</div>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">23 m</div>
          <div className="text-xs font-medium text-emerald-500 mt-1 flex items-center gap-1">
            ↓ 15% <span className="text-slate-400 font-normal">vs yesterday</span>
          </div>
        </div>
      </div>

    </div>
  );
}
