import { Bell, Sun } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex justify-between items-center py-6 px-8 bg-[#f8fafc]">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, Admin! Here's what's happening today.</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors bg-white border border-slate-200 shadow-sm">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors bg-white border border-slate-200 shadow-sm">
          <Sun size={18} />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold ml-2 cursor-pointer border border-blue-200">
          A
        </div>
      </div>
    </header>
  );
}
