import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  Menu, 
  User, 
  Settings, 
  LogOut, 
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { UserProfile, ScreenId } from '../../types/finance';
import { UserAvatar } from '../common/UIComponents';

interface HeaderProps {
  title: string;
  subtitle?: string;
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  user,
  onNavigate,
  onLogout,
  onToggleMobileMenu,
}) => {
  const { resolvedTheme, toggleQuickTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: '1', title: 'Salary Direct Deposit', body: '$4,225.00 posted to Premier Checking', time: '2 hours ago', unread: true },
    { id: '2', title: 'Dining Budget Alert', body: 'Reached 110% of monthly allocation', time: 'Yesterday', unread: true },
    { id: '3', title: 'Portfolio Milestone', body: 'Taxable brokerage crossed $75,000 threshold', time: '3 days ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left: Mobile Toggle & Page Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg lg:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Search, Theme Toggle, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Search */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions, goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>

        {/* Quick Theme Toggle (Sun/Moon) */}
        <button
          onClick={toggleQuickTheme}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
          title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme Mode"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-medium px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{n.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
          >
            <UserAvatar name={user.name} size="sm" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden sm:inline">
              {user.name.split(' ')[0]}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <Sun className="w-4 h-4 text-slate-400" />
                  Appearance & Theme
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                <button
                  onClick={() => {
                    onLogout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
