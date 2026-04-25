import { MoreVertical, Truck } from 'lucide-react';

export default function RecentShipments() {
  const shipments = [
    { id: 'SHP-1023', origin: 'Mumbai (IN)', dest: 'Kolkata Port (IN)', eta: '25 May, 10:30 AM', delay: '+18 mins delay', risk: 'High', status: 'In Transit' },
    { id: 'SHP-1024', origin: 'Delhi (IN)', dest: 'Chennai Port (IN)', eta: '25 May, 02:15 PM', delay: 'On Time', risk: 'Low', status: 'In Transit' },
  ];

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Truck className="text-blue-500" size={18} />
          Recent Shipments
        </h3>
        <button className="text-sm text-blue-600 font-semibold hover:text-blue-700">View All Shipments &gt;</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="text-xs text-slate-500 border-b border-slate-200">
            <tr>
              <th className="pb-3 font-semibold">Shipment ID</th>
              <th className="pb-3 font-semibold">Origin</th>
              <th className="pb-3 font-semibold">Destination</th>
              <th className="pb-3 font-semibold">ETA</th>
              <th className="pb-3 font-semibold">Risk Level</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shipments.map((s, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="py-3 font-medium text-slate-900">{s.id}</td>
                <td className="py-3">{s.origin}</td>
                <td className="py-3">{s.dest}</td>
                <td className="py-3">
                  <div className="text-slate-900">{s.eta}</div>
                  <div className={`text-xs ${s.delay.includes('+') ? 'text-orange-500' : 'text-emerald-500'}`}>{s.delay}</div>
                </td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    s.risk === 'High' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {s.risk}
                  </span>
                </td>
                <td className="py-3 text-blue-600 font-medium">{s.status}</td>
                <td className="py-3 text-slate-400 cursor-pointer hover:text-slate-600"><MoreVertical size={16} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
