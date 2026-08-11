import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Home, 
  ShieldCheck, 
  Plane, 
  Car, 
  GraduationCap, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Card, Button, ProgressBar, Badge, Modal } from '../common/UIComponents';
import { BudgetCategory, SavingsGoal } from '../../types/finance';
import { formatCurrency } from '../../utils/userUtils';

interface BudgetGoalsScreenProps {
  budgets: BudgetCategory[];
  goals: SavingsGoal[];
  onAddGoal: (goal: SavingsGoal) => void;
  onDepositGoal?: (goalId: string, depositAmount: number) => void;
  onUpdateBudget: (id: string, newAllocated: number) => void;
  userCurrency?: string;
}

export const BudgetGoalsScreen: React.FC<BudgetGoalsScreenProps> = ({
  budgets,
  goals,
  onAddGoal,
  onDepositGoal,
  onUpdateBudget,
  userCurrency,
}) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedDepositGoal, setSelectedDepositGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositError, setDepositError] = useState<string | null>(null);

  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editAllocated, setEditAllocated] = useState('');

  // New Goal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTargetAmount, setNewTargetAmount] = useState('');
  const [newCurrentAmount, setNewCurrentAmount] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [newCategory, setNewCategory] = useState<SavingsGoal['category']>('Travel');
  const [newMonthly, setNewMonthly] = useState('');

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercent = totalAllocated > 0
    ? Math.min(Math.round((totalSpent / totalAllocated) * 100), 100)
    : 0;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepositGoal) return;

    const val = parseFloat(depositAmount);
    if (isNaN(val) || val <= 0) {
      setDepositError('Please enter a valid deposit amount greater than zero.');
      return;
    }

    if (onDepositGoal) {
      onDepositGoal(selectedDepositGoal.id, val);
    }

    setSelectedDepositGoal(null);
    setDepositAmount('');
    setDepositError(null);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTargetAmount) return;

    const createdGoal: SavingsGoal = {
      id: `sg-${Date.now()}`,
      title: newTitle,
      targetAmount: parseFloat(newTargetAmount),
      currentAmount: parseFloat(newCurrentAmount || '0'),
      targetDate: newTargetDate || '2027-12-31',
      category: newCategory,
      iconName: newCategory === 'Housing' ? 'Home' : newCategory === 'Travel' ? 'Plane' : newCategory === 'Vehicle' ? 'Car' : 'Target',
      monthlyContribution: parseFloat(newMonthly || '200'),
    };

    onAddGoal(createdGoal);
    setShowGoalModal(false);
    setNewTitle('');
    setNewTargetAmount('');
    setNewCurrentAmount('');
  };

  const handleBudgetEditSave = (id: string) => {
    if (editAllocated) {
      onUpdateBudget(id, parseFloat(editAllocated));
    }
    setEditingBudgetId(null);
  };

  const getGoalIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Plane': return <Plane className="w-5 h-5" />;
      case 'Car': return <Car className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Budget & Savings Goals</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track monthly spending limits and automate long-term goal progress
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowGoalModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          New Savings Goal
        </Button>
      </div>

      {/* SECTION 1: Overall Monthly Budget Overview */}
      <Card className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">August Overall Budget</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {formatCurrency(totalSpent, userCurrency)} <span className="text-sm text-slate-400 font-normal">/ {formatCurrency(totalAllocated, userCurrency)} spent</span>
            </h3>
          </div>
          <Badge variant={overallPercent > 90 ? 'amber' : 'emerald'}>
            {overallPercent}% Used
          </Badge>
        </div>

        <ProgressBar
          value={overallPercent}
          heightClass="h-3"
          colorClass={overallPercent > 90 ? 'bg-amber-500' : 'bg-emerald-600 dark:bg-emerald-500'}
        />

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Remaining: {formatCurrency(totalAllocated - totalSpent, userCurrency)}</span>
          <span>27 days remaining in billing cycle</span>
        </div>
      </Card>

      {/* SECTION 2: Category Breakdown Bars */}
      <Card>
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">Category Budgets</h3>
        <div className="space-y-4">
          {budgets.map((b) => {
            const percent = Math.min(Math.round((b.spent / b.allocated) * 100), 120);
            const isOver = b.spent > b.allocated;

            return (
              <div key={b.id} className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{b.category}</span>
                    {isOver && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-semibold">
                        <AlertTriangle className="w-3 h-3" /> Over by {formatCurrency(b.spent - b.allocated, userCurrency)}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    {editingBudgetId === b.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editAllocated}
                          onChange={(e) => setEditAllocated(e.target.value)}
                          className="w-20 px-2 py-1 text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded"
                        />
                        <button
                          onClick={() => handleBudgetEditSave(b.id)}
                          className="text-xs font-semibold text-emerald-600 hover:underline"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingBudgetId(b.id);
                          setEditAllocated(b.allocated.toString());
                        }}
                        className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600"
                      >
                        {formatCurrency(b.spent, userCurrency)} / <span className="text-slate-400 font-normal">{formatCurrency(b.allocated, userCurrency)}</span>
                      </button>
                    )}
                  </div>
                </div>

                <ProgressBar
                  value={percent}
                  heightClass="h-2"
                  colorClass={isOver ? 'bg-amber-500' : 'bg-emerald-600 dark:bg-emerald-500'}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* SECTION 3: Savings Goals Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Savings Goals</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Automated targets with visual completion rings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const pct = Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100);
            const isCompleted = g.currentAmount >= g.targetAmount;

            return (
              <Card key={g.id} className="relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCompleted ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}>
                        {getGoalIcon(g.iconName)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                          {g.title}
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </h4>
                        <span className="text-[11px] text-slate-400">Target: {g.targetDate}</span>
                      </div>
                    </div>
                    <Badge variant={isCompleted ? 'emerald' : 'blue'}>
                      {isCompleted ? 'COMPLETED' : `${pct}%`}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between text-xs mb-1.5">
                      <span className="font-bold text-base text-slate-900 dark:text-white">
                        {formatCurrency(g.currentAmount, userCurrency)}
                      </span>
                      <span className="text-slate-400">
                        of {formatCurrency(g.targetAmount, userCurrency)}
                      </span>
                    </div>
                    <ProgressBar
                      value={pct}
                      heightClass="h-2.5"
                      colorClass={isCompleted ? 'bg-emerald-500' : 'bg-emerald-600 dark:bg-emerald-500'}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Auto-deposit: {formatCurrency(g.monthlyContribution, userCurrency)}/mo</span>
                  <button 
                    onClick={() => {
                      setSelectedDepositGoal(g);
                      setDepositAmount('');
                      setDepositError(null);
                    }}
                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Deposit
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Deposit to Goal Modal */}
      <Modal
        isOpen={!!selectedDepositGoal}
        onClose={() => setSelectedDepositGoal(null)}
        title={selectedDepositGoal ? `Deposit to ${selectedDepositGoal.title}` : 'Deposit Funds'}
      >
        {selectedDepositGoal && (
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Current Balance:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(selectedDepositGoal.currentAmount, userCurrency)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400">Target Goal:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {formatCurrency(selectedDepositGoal.targetAmount, userCurrency)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="text-slate-500 dark:text-slate-400">Remaining to reach 100%:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(Math.max(0, selectedDepositGoal.targetAmount - selectedDepositGoal.currentAmount), userCurrency)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deposit Amount *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="5000"
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(e.target.value);
                    setDepositError(null);
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-semibold"
                />
              </div>
              {depositError && (
                <p className="text-[11px] text-rose-500 mt-1">{depositError}</p>
              )}
            </div>

            {/* Quick addition chips */}
            <div>
              <span className="block text-[11px] text-slate-400 mb-1.5 font-medium">Quick Deposit Options:</span>
              <div className="flex flex-wrap gap-2">
                {[1000, 5000, 10000, 25000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      const cur = parseFloat(depositAmount) || 0;
                      setDepositAmount((cur + amt).toString());
                      setDepositError(null);
                    }}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-700/60 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                  >
                    +{formatCurrency(amt, userCurrency)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <Button
                variant="ghost"
                size="md"
                type="button"
                onClick={() => setSelectedDepositGoal(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Confirm Deposit
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Add Goal Modal */}
      <Modal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        title="Create New Savings Goal"
      >
        <form onSubmit={handleGoalSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Goal Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New House Down Payment"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Amount (₹)
              </label>
              <input
                type="number"
                required
                placeholder="100000"
                value={newTargetAmount}
                onChange={(e) => setNewTargetAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Saved (₹)
              </label>
              <input
                type="number"
                placeholder="1000"
                value={newCurrentAmount}
                onChange={(e) => setNewCurrentAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="Housing">Housing</option>
                <option value="Emergency">Emergency</option>
                <option value="Travel">Travel</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowGoalModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Create Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
