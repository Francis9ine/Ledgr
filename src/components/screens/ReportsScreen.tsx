import React, { useState } from 'react';
import { BarChart3, PieChart as PieChartIcon, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card, Button, Badge } from '../common/UIComponents';
import { BudgetCategory } from '../../types/finance';
import { formatCurrency } from '../../utils/userUtils';

interface ReportsScreenProps {
  budgets: BudgetCategory[];
  userCurrency?: string;
}

const monthlyComparativeData = [
  { month: 'Jan', Income: 110000, Expenses: 42000 },
  { month: 'Feb', Income: 115000, Expenses: 44000 },
  { month: 'Mar', Income: 110000, Expenses: 45000 },
  { month: 'Apr', Income: 115000, Expenses: 48000 },
  { month: 'May', Income: 120000, Expenses: 46000 },
  { month: 'Jun', Income: 125000, Expenses: 51000 },
  { month: 'Jul', Income: 125000, Expenses: 49000 },
  { month: 'Aug', Income: 125000, Expenses: 48500 },
];

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ budgets, userCurrency }) => {
  const [timeframe, setTimeframe] = useState<'3M' | '6M' | 'YTD' | '1Y'>('YTD');

  const categoryPieData = budgets.map((b) => ({
    name: b.category,
    value: b.spent,
    color: b.color,
  }));

  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Reports</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep insights into income velocity, category spending distribution, and net worth growth
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          {(['3M', '6M', 'YTD', '1Y'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 font-semibold rounded-md transition-all ${timeframe === t ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Income vs Expense Comparative Bar Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Income vs Expense Comparison</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly cash flow breakdown for {timeframe}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-slate-400 dark:bg-slate-600" />
              <span className="text-slate-600 dark:text-slate-300">Expenses</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyComparativeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [formatCurrency(Number(val), userCurrency), '']}
              />
              <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="#64748B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Category Pie Chart & Category Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Spending Share by Category</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">August distribution ({formatCurrency(totalSpent, userCurrency)})</p>
          </div>

          <div className="h-64 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [formatCurrency(Number(val), userCurrency), 'Spent']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {categoryPieData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{cat.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">Category Breakdown Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Allocated</th>
                  <th className="pb-3 font-semibold">Spent</th>
                  <th className="pb-3 font-semibold text-right">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {budgets.map((b) => {
                  const diff = b.allocated - b.spent;
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                        <span>{b.category}</span>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">{formatCurrency(b.allocated, userCurrency)}</td>
                      <td className="py-3 text-slate-900 dark:text-white font-semibold">{formatCurrency(b.spent, userCurrency)}</td>
                      <td className={`py-3 text-right font-bold ${diff >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {diff >= 0 ? `+${formatCurrency(diff, userCurrency)}` : formatCurrency(diff, userCurrency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
