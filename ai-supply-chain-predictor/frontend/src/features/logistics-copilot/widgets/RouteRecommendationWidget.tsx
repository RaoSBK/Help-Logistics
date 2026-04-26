import { Map, ArrowRight, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface RouteRecommendationProps {
  data: {
    originalRoute: string;
    newRoute: string;
    timeImpact: string;
    riskReduction: string;
  };
}

export default function RouteRecommendationWidget({ data }: RouteRecommendationProps) {
  const [applied, setApplied] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-blue-200 shadow-sm mt-3 overflow-hidden font-sans w-full max-w-sm">
      <div className="bg-blue-50/50 px-4 py-3 border-b border-blue-100 flex items-center gap-2">
        <Map className="text-blue-600" size={16} />
        <span className="font-semibold text-sm text-blue-900">Recommended Reroute</span>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Current</span>
            <span className="font-medium text-slate-700">{data.originalRoute}</span>
          </div>
          <ArrowRight className="text-slate-300 mx-2" size={16} />
          <div className="flex flex-col text-right">
            <span className="text-xs text-blue-500 font-medium uppercase tracking-wider mb-1">Optimal</span>
            <span className="font-semibold text-blue-700">{data.newRoute}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="bg-orange-50 p-1.5 rounded-lg">
              <Clock className="text-orange-500" size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium">Time Impact</span>
              <span className="text-xs font-semibold text-orange-700">{data.timeImpact}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-emerald-50 p-1.5 rounded-lg">
              <ShieldCheck className="text-emerald-500" size={14} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium">Risk Reduced</span>
              <span className="text-xs font-semibold text-emerald-700">{data.riskReduction}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setApplied(true)}
          disabled={applied}
          className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            applied 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
          }`}
        >
          {applied ? (
            <>
              <CheckCircle2 size={16} /> Route Applied Successfully
            </>
          ) : (
            'Apply Alternate Route'
          )}
        </button>
      </div>
    </div>
  );
}
