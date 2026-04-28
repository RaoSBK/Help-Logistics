import { Bell, Sun, Moon, X, CheckCheck, Trash2, User, LogOut, Settings } from 'lucide-react';
import { useStore, type AppNotification } from '../../store/useStore';
import { useRef, useState, useEffect } from 'react';

// ─── helpers ────────────────────────────────────────────────────────────────

const severityStyles: Record<AppNotification['severity'], { bar: string; bg: string; badge: string }> = {
  critical: { bar: 'bg-red-500',    bg: 'bg-red-50 dark:bg-red-500/15',     badge: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' },
  warning:  { bar: 'bg-amber-400',  bg: 'bg-amber-50 dark:bg-amber-500/15',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
  info:     { bar: 'bg-blue-400',   bg: 'bg-blue-50 dark:bg-blue-500/15',    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' },
  success:  { bar: 'bg-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-500/15', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' },
};

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)  return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

// ─── sub-components ─────────────────────────────────────────────────────────

function NotificationItem({ n, onDismiss }: { n: AppNotification; onDismiss: (id: string) => void }) {
  const s = severityStyles[n.severity];
  return (
    <div className={`flex gap-3 p-3 rounded-lg ${s.bg} relative group transition-all`}>
      <div className={`w-1 rounded-full flex-shrink-0 self-stretch ${s.bar}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{n.title}</span>
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${s.badge} uppercase tracking-wide`}>
            {n.severity}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">{timeAgo(n.timestamp)}</span>
      </div>
      <button
        onClick={() => onDismiss(n.id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded"
      >
        <X size={12} />
      </button>
    </div>
  );
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { notifications, unreadCount, markAllRead, clearNotification, clearAll } = useStore();

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden flex flex-col max-h-[520px]"
         style={{ animation: 'slideDown 0.18s ease-out' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-slate-600 dark:text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <>
              <button
                onClick={markAllRead}
                title="Mark all read"
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/15 rounded-lg transition-colors"
              >
                <CheckCheck size={14} />
              </button>
              <button
                onClick={clearAll}
                title="Clear all"
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors ml-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Bell size={32} className="mb-3 opacity-30" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs mt-1 opacity-70">Live alerts will appear here</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {notifications.map((n) => (
              <NotificationItem key={n.id} n={n} onDismiss={clearNotification} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-700 px-4 py-2.5 flex-shrink-0 bg-slate-50 dark:bg-slate-800/80">
          <p className="text-xs text-slate-400 text-center">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''} · updates every 8s
          </p>
        </div>
      )}
    </div>
  );
}

function ProfileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
         style={{ animation: 'slideDown 0.18s ease-out' }}>
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin User</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">admin@shipguard.ai</p>
      </div>
      <div className="py-1.5">
        {[
          { icon: User, label: 'Profile' },
          { icon: Settings, label: 'Settings' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon size={15} className="text-slate-400 dark:text-slate-500" />
            {label}
          </button>
        ))}
      </div>
      <div className="border-t border-slate-100 dark:border-slate-700 py-1.5">
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Main Header ─────────────────────────────────────────────────────────────

export default function Header() {
  const { unreadCount, isDark, toggleTheme } = useStore();

  const [notifOpen,   setNotifOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      {/* Keyframe injected once */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <header className="flex justify-between items-center py-6 px-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, Admin! Here's what's happening today.</p>
        </div>


        <div className="flex items-center gap-3">

          {/* ── Notification Bell ── */}
          <div className="relative" ref={notifRef}>
            <button
              id="btn-notifications"
              onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full px-0.5 border border-white dark:border-slate-800">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </div>

          {/* ── Theme Toggle ── */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* ── Profile Avatar ── */}
          <div className="relative" ref={profileRef}>
            <button
              id="btn-profile"
              onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
              className="flex items-center gap-1.5 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 hover:ring-2 hover:ring-blue-300 dark:hover:ring-blue-600 transition-all cursor-pointer justify-center"
            >
              A
            </button>
            {profileOpen && <ProfileMenu onClose={() => setProfileOpen(false)} />}
          </div>

        </div>
      </header>
    </>
  );
}

