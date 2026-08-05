import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieIcon, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, Button, Badge } from '../common/UIComponents';
import { Holding } from '../../types/finance';
import { formatCurrency } from '../../utils/userUtils';

interface InvestmentsScreenProps {
  holdings: Holding[];
  userCurrency?: string;
}

const performanceTimelineData = {
  '1D': [
    { time: '9:30 AM', value: 2450000 },
    { time: '11:00 AM', value: 2465000 },
    { time: '1:00 PM', value: 2458000 },
    { time: '3:00 PM', value: 2472000 },
    { time: '4:00 PM', value: 2485000 },
  ],
  '1W': [
    { time: 'Mon', value: 2410000 },
    { time: 'Tue', value: 2435000 },
    { time: 'Wed', value: 2420000 },
    { time: 'Thu', value: 2460000 },
    { time: 'Fri', value: 2485000 },
  ],
  '1M': [
    { time: 'Week 1', value: 2320000 },
    { time: 'Week 2', value: 2380000 },
    { time: 'Week 3', value: 2410000 },
    { time: 'Week 4', value: 2485000 },
  ],
  '1Y': [
    { time: 'Q1', value: 2100000 },
    { time: 'Q2', value: 2220000 },
    { time: 'Q3', value: 2350000 },
    { time: 'Q4', value: 2485000 },
  ],
  'ALL': [
    { time: '2023', value: 1450000 },
    { time: '2024', value: 1820000 },
    { time: '2025', value: 2180000 },
    { time: '2026', value: 2485000 },
  ]
};

const allocationData = [
  { name: 'US Equities (VTI/AAPL)', value: 64.3, color: '#10B981' },
  { name: 'Tech Growth (NVDA)', value: 18.2, color: '#3B82F6' },
  { name: 'Intl Equities (VXUS)', value: 12.5, color: '#8B5CF6' },
  { name: 'Bonds & Cash (BND)', value: 5.0, color: '#64748B' },
];

export const InvestmentsScreen: React.FC<InvestmentsScreenProps> = ({ holdings, userCurrency }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.avgCost), 0);
  const totalGainLoss = totalPortfolioValue - totalCost;
  const totalGainPercent = (totalGainLoss / totalCost) * 100;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Taxable Brokerage Portfolio</span>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {formatCurrency(totalPortfolioValue, userCurrency)}
            </h2>
            <span className="inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              <ArrowUpRight className="w-3.5 h-3.5" /> +{formatCurrency(totalGainLoss, userCurrency)} ({totalGainPercent.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((t) => (
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

      {/* Portfolio Performance Line Chart */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Performance Trajectory</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Time-weighted portfolio value changes for {timeframe}</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceTimelineData[timeframe]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [formatCurrency(Number(val), userCurrency), 'Portfolio Value']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10B981' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Asset Allocation & Positions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Allocation Donut Chart */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Asset Allocation</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Target risk & diversification balance</p>
          </div>

          <div className="h-56 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
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
                  formatter={(val: any) => [`${val}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* My Positions Holdings Table */}
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">My Positions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-semibold">Asset / Symbol</th>
                  <th className="pb-3 font-semibold">Shares</th>
                  <th className="pb-3 font-semibold">Avg Cost</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Total Value</th>
                  <th className="pb-3 font-semibold text-right">Day Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {holdings.map((h) => {
                  const currentVal = h.shares * h.currentPrice;
                  const isPositive = h.dayChangePercent >= 0;

                  return (
                    <tr key={h.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center justify-center text-[10px]">
                          {h.symbol}
                        </span>
                        <div>
                          <span>{h.name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{h.type}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{h.shares}</td>
                      <td className="py-3 text-slate-500">{formatCurrency(h.avgCost, userCurrency)}</td>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{formatCurrency(h.currentPrice, userCurrency)}</td>
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{formatCurrency(currentVal, userCurrency)}</td>
                      <td className={`py-3 text-right font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isPositive ? `+${h.dayChangePercent}%` : `${h.dayChangePercent}%`}
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
