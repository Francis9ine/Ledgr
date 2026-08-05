import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  Sparkles, 
  Wallet, 
  CreditCard, 
  PiggyBank, 
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard, Card, Button, Badge } from '../common/UIComponents';
import { Account, Transaction, FinancialInsight, ScreenId } from '../../types/finance';
import { formatCurrency } from '../../utils/userUtils';

interface DashboardScreenProps {
  userName: string;
  accounts: Account[];
  transactions: Transaction[];
  insights: FinancialInsight[];
  onNavigate: (screen: ScreenId) => void;
  onOpenAddTransaction: () => void;
  userCurrency?: string;
}

const monthlyCashFlowData = [
  { month: 'Mar', income: 110000, expense: 45000, net: 65000 },
  { month: 'Apr', income: 115000, expense: 48000, net: 67000 },
  { month: 'May', income: 120000, expense: 46000, net: 74000 },
  { month: 'Jun', income: 125000, expense: 51000, net: 74000 },
  { month: 'Jul', income: 125000, expense: 49000, net: 76000 },
  { month: 'Aug', income: 125000, expense: 48500, net: 76500 },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName,
  accounts,
  transactions,
  insights,
  onNavigate,
  onOpenAddTransaction,
  userCurrency,
}) => {
  const [selectedInsightIndex, setSelectedInsightIndex] = useState(0);

  const totalChecking = accounts.find(a => a.type === 'checking')?.balance || 0;
  const totalSavings = accounts.find(a => a.type === 'savings')?.balance || 0;
  const totalInvestments = accounts.find(a => a.type === 'investment')?.balance || 0;
  const totalCredit = accounts.find(a => a.type === 'credit')?.balance || 0;

  const totalNetWorth = totalChecking + totalSavings + totalInvestments + totalCredit;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Accounts Synced 5m ago</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Good Morning, {userName.split(' ')[0]} 👋
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Here is your financial summary for Tuesday, August 4, 2026.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onNavigate('accounts')}
          >
            Manage Accounts
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={onOpenAddTransaction}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Net Worth"
          value={formatCurrency(totalNetWorth, userCurrency)}
          change="+4.2%"
          changeType="positive"
          subtitle="vs last month"
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(125000, userCurrency)}
          change="+6.8%"
          changeType="positive"
          subtitle="expected ₹1,20,000"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(48500, userCurrency)}
          change="-2.1%"
          changeType="positive" // spending down is positive
          subtitle="budget ₹55,000"
          icon={<CreditCard className="w-5 h-5" />}
        />
        <StatCard
          title="Total Savings"
          value={formatCurrency(totalSavings, userCurrency)}
          change="+7.20% APY"
          changeType="positive"
          subtitle="ICICI High Yield"
          icon={<PiggyBank className="w-5 h-5" />}
        />
      </div>

      {/* Main Row: Cash Flow Chart + AI Insights Module */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Line/Area Chart */}
        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Cash Flow Trajectory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly income vs expenses over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-slate-600 dark:text-slate-300">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-600" />
                <span className="text-slate-600 dark:text-slate-300">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyCashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    borderColor: '#334155', 
                    borderRadius: '8px', 
                    color: '#FFF',
                    fontSize: '12px'
                  }} 
                  formatter={(val: any) => [formatCurrency(Number(val), userCurrency), '']}
                />
                <Area type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="expense" stroke="#64748B" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Smart Insights & Popular Questions Module */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Smart Insights</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Personalized AI financial suggestions</p>
              </div>
            </div>

            <div className="space-y-3">
              {insights.map((ins, idx) => (
                <div
                  key={ins.id}
                  onClick={() => setSelectedInsightIndex(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedInsightIndex === idx
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-2xs'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {ins.type === 'ai' && <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                      {ins.type === 'warning' && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                      {ins.type === 'opportunity' && <Lightbulb className="w-3.5 h-3.5 text-blue-500" />}
                      {ins.title}
                    </span>
                    <span className="text-[10px] text-slate-400">{ins.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {ins.description}
                  </p>
                  {ins.actionText && ins.actionScreen && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(ins.actionScreen!);
                      }}
                      className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>{ins.actionText}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions Preview Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Activity across connected accounts</p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View All Transactions</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Merchant / Source</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Account</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
              {transactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs uppercase">
                      {tx.merchant.charAt(0)}
                    </div>
                    <div>
                      <span>{tx.merchant}</span>
                      {tx.note && <span className="block text-[10px] text-slate-400 font-normal">{tx.note}</span>}
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant={tx.amount > 0 ? 'emerald' : 'slate'}>
                      {tx.category}
                    </Badge>
                  </td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{tx.accountName}</td>
                  <td className="py-3 text-slate-500 dark:text-slate-400">{tx.date}</td>
                  <td className={`py-3 text-right font-bold ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.amount > 0 ? `+${formatCurrency(tx.amount, userCurrency)}` : formatCurrency(tx.amount, userCurrency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
