import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Lock, 
  CheckCircle2,
  Sparkles,
  PieChart,
  Target
} from 'lucide-react';
import { ScreenId } from '../../types/finance';
import { Button } from '../common/UIComponents';
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
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors relative overflow-hidden">
      {/* Background Soft Emerald Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Header Bar */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <span className="font-bold text-xl">L</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Ledgr</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onLogin}
            className="text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            Log In
          </button>
          <Button variant="primary" size="sm" onClick={onGetStarted}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Next-Gen Personal Wealth Platform</span>
        </div>

        {/* Headline & Tagline */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-slate-900 dark:text-white">
          Simplifying your Financial Life.
        </h1>
        <p className="mt-6 text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Track cash flow, automate savings goals, and monitor investments in one unified, bank-grade interface designed for absolute clarity.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex items-center justify-center">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={onGetStarted}
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-lg shadow-emerald-600/25 px-8"
          >
            Get Started Free
          </Button>
        </div>

        {/* Security & Trust Badges */}

        {/* Interactive App Mockup Preview Card */}
        <div className="mt-16 max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl overflow-hidden p-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400 ml-2 font-mono">ledgr.app/dashboard</span>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
              Live Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Net Worth</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$142,850.00</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">↑ +4.2% this month</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Budget</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$3,920 / $5,500</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">71% spent • On track</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-xs text-slate-500 dark:text-slate-400">Investments</p>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$78,420.50</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">↑ +12.4% YTD</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Smart Cash Flow</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Consolidate checking, savings, and credit cards into one automated real-time ledger.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Goal Automation</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Set house down payment or travel goals with visual progress rings and monthly auto-contributions.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio Tracking</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Monitor asset allocations across stocks, ETFs, and bonds with clean interactive chart tools.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
