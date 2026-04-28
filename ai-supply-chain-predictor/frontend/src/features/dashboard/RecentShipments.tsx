import { MoreVertical, Truck } from 'lucide-react';

export default function RecentShipments() {
  const shipments = [
    { id: 'SHP-1023', origin: 'Mumbai (IN)', dest: 'Kolkata Port (IN)', eta: '25 May, 10:30 AM', delay: '+18 mins delay', risk: 'High', status: 'In Transit' },
    { id: 'SHP-1024', origin: 'Delhi (IN)', dest: 'Chennai Port (IN)', eta: '25 May, 02:15 PM', delay: 'On Time', risk: 'Low', status: 'In Transit' },
  ];

  return (
    <div className="glass-panel p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <Truck className="text-blue-500" size={18} />
          Recent Shipments
        </h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300">View All Shipments &gt;</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
          <thead className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-600">
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
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {shipments.map((s, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                <td className="py-3 font-medium text-slate-900 dark:text-slate-100">{s.id}</td>
                <td className="py-3">{s.origin}</td>
                <td className="py-3">{s.dest}</td>
                <td className="py-3">
                  <div className="text-slate-900 dark:text-slate-100">{s.eta}</div>
                  <div className={`text-xs ${s.delay.includes('+') ? 'text-orange-500' : 'text-emerald-500'}`}>{s.delay}</div>
                </td>
                <td className="py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    s.risk === 'High' ? 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400' : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {s.risk}
                  </span>
                </td>
                <td className="py-3 text-blue-600 dark:text-blue-400 font-medium">{s.status}</td>
                <td className="py-3 text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300"><MoreVertical size={16} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
