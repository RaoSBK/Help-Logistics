import { AlertTriangle, Info } from 'lucide-react';

interface RiskAssessmentProps {
  data: {
    currentRisk: string;
    primaryFactor: string;
    affectedRoute: string;
  };
}

export default function RiskAssessmentWidget({ data }: RiskAssessmentProps) {
  const isHighRisk = data.currentRisk === 'HIGH' || data.currentRisk === 'CRITICAL';
  
  return (
    <div className={`rounded-xl border shadow-sm mt-3 overflow-hidden font-sans w-full max-w-sm ${
      isHighRisk ? 'border-red-200 bg-white' : 'border-orange-200 bg-white'
    }`}>
      <div className={`px-4 py-3 border-b flex items-center gap-2 ${
        isHighRisk ? 'bg-red-50/50 border-red-100 text-red-900' : 'bg-orange-50/50 border-orange-100 text-orange-900'
      }`}>
        <AlertTriangle size={16} className={isHighRisk ? 'text-red-600' : 'text-orange-600'} />
        <span className="font-semibold text-sm">Risk Assessment: {data.currentRisk}</span>
      </div>
      
      <div className="p-4 space-y-3 text-sm">
        <div className="flex gap-3 items-start">
          <div className="mt-0.5">
            <Info size={16} className="text-slate-400" />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Primary Factor</span>
            <span className="font-medium text-slate-700">{data.primaryFactor}</span>
          </div>
        </div>
        
        <div className="flex gap-3 items-start">
          <div className="mt-0.5">
            <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
            </div>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Affected Route</span>
            <span className="font-medium text-slate-700">{data.affectedRoute}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
