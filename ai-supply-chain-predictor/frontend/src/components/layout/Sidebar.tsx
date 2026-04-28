import { Home, Package, Map, ShieldAlert, BarChart2, Bell, FileText, Settings, Box } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Package, label: 'Shipments', active: false },
    { icon: Map, label: 'Routes', active: false },
    { icon: ShieldAlert, label: 'Risk Engine', active: false },
    { icon: BarChart2, label: 'Analytics', active: false },
    { icon: Bell, label: 'Alerts', active: false },
    { icon: FileText, label: 'Reports', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-2">
        <div className="bg-brand-600 text-white p-1.5 rounded">
          <Box size={20} />
        </div>
        <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">ShipGuard <span className="text-brand-600 font-black text-2xl leading-none -ml-0.5">.</span><span className="text-brand-600 text-sm ml-0.5 font-semibold">AI</span></span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navItems.map((item, idx) => (
          <a
            key={idx}
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active 
                ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <item.icon size={18} className={item.active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'} />
            {item.label}
          </a>
        ))}
      </nav>

      <div className="p-4">
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <ShieldAlert size={14} className="text-emerald-500" /> System Status
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            All Systems Operational
          </div>
        </div>

        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm">
            A
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">Admin User</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@shipguard.ai</div>
          </div>
        </div>
      </div>
    </div>
  );
}
