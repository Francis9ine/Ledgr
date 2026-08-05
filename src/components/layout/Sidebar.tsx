import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ReceiptText, 
  BarChart3, 
  Target, 
  TrendingUp, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ScreenId } from '../../types/finance';

interface SidebarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  onLogout,
  isMobileOpen,
  onCloseMobile,
}) => {
  const mainNavItems: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'accounts', label: 'Accounts', icon: <Wallet className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <ReceiptText className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'budget-goals', label: 'Budget & Goals', icon: <Target className="w-5 h-5" /> },
    { id: 'investments', label: 'Investments', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 
        flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Logo & Brand */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <span className="font-bold text-lg tracking-wider">L</span>
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight leading-tight block">
                  Ledgr
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold block">
                  Financial Control
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 mt-2">
            <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Menu
            </div>
            {mainNavItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs border-l-4 border-emerald-600 dark:border-emerald-500 pl-2' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 opacity-80" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Pinned Links & Security Badge */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Support
          </div>
          
          <button
            onClick={() => {
              onNavigate('help');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${activeScreen === 'help'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold border-l-4 border-emerald-600 dark:border-emerald-500 pl-2'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
            `}
          >
            <HelpCircle className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            <span>Help Center</span>
          </button>
          {/* Bank Security Trust Pill */}
        </div>
      </aside>
    </>
  );
};
