import React, { useState } from 'react';
import { ArrowRight, TrendingUp, Target, PieChart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LandingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onDirectDemo: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onGetStarted,
  onLogin,
  onDirectDemo,
}) => {
  useTheme();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  const navFeatures = [
    {
      id: 'smart-cash-flow',
      label: 'Smart Cash Flow',
      icon: TrendingUp,
      description: 'Consolidate checking, savings, and credit cards into one automated real-time ledger.',
    },
    {
      id: 'goal-automation',
      label: 'Goal Automation',
      icon: Target,
      description: 'Set house down payment or travel goals with visual progress rings and monthly auto-contributions.',
    },
    {
      id: 'portfolio-tracking',
      label: 'Portfolio Tracking',
      icon: PieChart,
      description: 'Monitor asset allocations across stocks, ETFs, and bonds with clean interactive chart tools.',
    },
  ];

  const stats = [
    { label: 'Total Net Worth', value: '$142,850.00', delta: '↑ +4.2% this month', positive: true },
    { label: 'Monthly Budget', value: '$3,920 / $5,500', delta: '71% spent · on track', positive: false },
    { label: 'Investments', value: '$78,420.50', delta: '↑ +12.4% YTD', positive: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
      <style>{`
        @keyframes ledgrLogoPop {
          0% { opacity: 0; transform: scale(0.85); }
          45% { opacity: 1; transform: scale(1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ledgrPanelLift {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes ledgrOverlayOut {
          0% { opacity: 1; visibility: visible; pointer-events: auto; }
          92% { opacity: 1; visibility: visible; pointer-events: auto; }
          100% { opacity: 0; visibility: hidden; pointer-events: none; }
        }
        @keyframes ledgrFadeUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ledgr-intro-overlay {
          animation: ledgrOverlayOut 1.9s ease-out forwards;
        }
        .ledgr-intro-panel {
          animation: ledgrPanelLift 0.7s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .ledgr-intro-logo {
          animation: ledgrLogoPop 0.55s ease-out forwards;
        }
        .ledgr-content-in {
          animation-name: ledgrFadeUp;
          animation-duration: 0.7s;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .ledgr-intro-overlay, .ledgr-intro-panel, .ledgr-intro-logo, .ledgr-content-in {
            animation: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: none !important;
          }
          .ledgr-intro-overlay { display: none !important; }
        }
      `}</style>

      {/* Intro curtain — pure CSS, self-clears even if React re-renders */}
      <div className="ledgr-intro-overlay fixed inset-0 z-[999] flex" aria-hidden="true">
        <div className="ledgr-intro-panel flex-1 bg-emerald-600" style={{ animationDelay: '0.9s' }} />
        <div className="ledgr-intro-panel flex-1 bg-emerald-600 flex items-center justify-center" style={{ animationDelay: '0.98s' }}>
          <span className="ledgr-intro-logo text-white font-black text-3xl md:text-5xl tracking-tight">
            Ledgr<span className="align-super text-base">®</span>
          </span>
        </div>
        <div className="ledgr-intro-panel flex-1 bg-emerald-600" style={{ animationDelay: '1.06s' }} />
      </div>

      {/* Background Soft Emerald Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header
        className="ledgr-content-in max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10"
        style={{ animationDelay: '1.0s' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <span className="font-bold text-xl">L</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Ledgr</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {navFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="relative"
                onMouseEnter={() => setHoveredNav(feature.id)}
                onMouseLeave={() => setHoveredNav(null)}
              >
                <button type="button" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-default">
                  {feature.label}
                </button>

                {hoveredNav === feature.id && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 z-20">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4 text-left">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{feature.label}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-t border-slate-200 dark:border-slate-800 pt-10">
          {/* Headline + copy + CTA bar */}
          <div className="md:col-span-12">
            <div
              className="ledgr-content-in flex items-center gap-2 text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-6"
              style={{ animationDelay: '1.15s' }}
            >
              <span className="text-emerald-600 dark:text-emerald-400">*</span>
              <span>TAKE CONTROL OF YOUR MONEY</span>
            </div>

            <h1
              className="ledgr-content-in text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.05] text-slate-900 dark:text-white"
              style={{ animationDelay: '1.25s' }}
            >
              Simplify your finances
<br />
<span className="bg-emerald-600 text-white px-2 inline-block">[10x]</span> without
<br />
<span className="bg-emerald-600 text-white px-2 inline-block">[the stress]</span>.
            </h1>

            <p
              className="ledgr-content-in mt-6 max-w-xl text-slate-600 dark:text-slate-300 text-base md:text-lg font-normal leading-relaxed"
              style={{ animationDelay: '1.35s' }}
            >
              I've built a single, bank-grade ledger that handles your cash flow, savings goals, and investments — so you can focus on your life, not your spreadsheets.
            </p>

            <div
              className="ledgr-content-in mt-8 max-w-md border-y border-slate-300 dark:border-slate-700"
              style={{ animationDelay: '1.45s' }}
            >
              <div className="flex divide-x divide-slate-300 dark:divide-slate-700">
                <button
                  onClick={onGetStarted}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold tracking-widest uppercase text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onLogin}
                  className="flex-1 px-4 py-3 text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Giant background wordmark */}
        <div
          aria-hidden="true"
          className="ledgr-content-in pointer-events-none select-none mt-10 md:mt-16 text-center leading-none overflow-hidden"
          style={{ animationDelay: '1.6s' }}
        >
          <span className="text-[16vw] font-black uppercase tracking-tighter text-slate-200 dark:text-slate-900">
            Ledgr
          </span>
        </div>

        {/* Live stats dashboard — now sits where the feature grid used to be */}
        <div className="ledgr-content-in max-w-3xl mx-auto mt-4 md:mt-8 relative z-10" style={{ animationDelay: '1.7s' }}>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">ledgr.app/dashboard</span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
              {stats.map((s) => (
                <div key={s.label} className="px-5 py-4">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.label}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">{s.value}</p>
                  <p className={`text-[11px] mt-1 font-medium ${s.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {s.delta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};