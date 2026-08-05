import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronLeft, 
  ChevronRight,
  ReceiptText
} from 'lucide-react';
import { Card, Button, Modal, Badge } from '../common/UIComponents';
import { Transaction, TransactionCategory, Account } from '../../types/finance';
import { formatCurrency } from '../../utils/userUtils';

interface TransactionsScreenProps {
  transactions: Transaction[];
  accounts: Account[];
  onAddTransaction: (newTx: Transaction) => void;
  userCurrency?: string;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  transactions,
  accounts,
  onAddTransaction,
  userCurrency,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Transaction Form State
  const [newMerchant, setNewMerchant] = useState('');
  const [newCategory, setNewCategory] = useState<TransactionCategory>('Dining');
  const [newAmount, setNewAmount] = useState('');
  const [isIncome, setIsIncome] = useState(false);
  const [newAccountId, setNewAccountId] = useState(accounts[0]?.id || 'acc-1');
  const [newNote, setNewNote] = useState('');

  const categories: TransactionCategory[] = [
    'Housing', 'Groceries', 'Dining', 'Shopping', 'Transportation', 
    'Utilities', 'Entertainment', 'Income', 'Investments', 'Healthcare', 'Subscribed Services'
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
      const matchesAccount = selectedAccount === 'all' || tx.accountId === selectedAccount;
      const matchesType = selectedType === 'all' || 
                          (selectedType === 'income' && tx.amount > 0) || 
                          (selectedType === 'expense' && tx.amount < 0);

      return matchesSearch && matchesCategory && matchesAccount && matchesType;
    });
  }, [transactions, searchTerm, selectedCategory, selectedAccount, selectedType]);

  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchant || !newAmount) return;

    const parsedAmount = parseFloat(newAmount);
    const finalAmount = isIncome ? Math.abs(parsedAmount) : -Math.abs(parsedAmount);
    const accountObj = accounts.find(a => a.id === newAccountId);

    const createdTx: Transaction = {
      id: `tx-${Date.now()}`,
      merchant: newMerchant,
      category: isIncome ? 'Income' : newCategory,
      amount: finalAmount,
      date: new Date().toISOString().split('T')[0],
      accountId: newAccountId,
      accountName: accountObj?.name || 'Premier Checking',
      status: 'completed',
      note: newNote,
    };

    onAddTransaction(createdTx);
    setShowAddModal(false);
    setNewMerchant('');
    setNewAmount('');
    setNewNote('');
  };

  const handleExportCSV = () => {
    const headers = 'Merchant,Category,Amount,Date,Account,Note\n';
    const rows = filteredTransactions.map(t => 
      `"${t.merchant}","${t.category}",${t.amount},"${t.date}","${t.accountName}","${t.note || ''}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ledgr_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Page Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Transactions</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and organize all posted income and expenses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" onClick={handleExportCSV} icon={<Download className="w-4 h-4" />}>
            Export CSV
          </Button>
          <Button variant="primary" size="md" onClick={() => setShowAddModal(true)} icon={<Plus className="w-4 h-4" />}>
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchant or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Account Filter */}
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>

          {/* Type Filter Segment */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedType('all')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all ${selectedType === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all ${selectedType === 'income' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Income
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`flex-1 py-1 text-[11px] font-semibold rounded-md transition-all ${selectedType === 'expense' ? 'bg-slate-900 dark:bg-slate-600 text-white shadow-2xs' : 'text-slate-500 dark:text-slate-400'}`}
            >
              Expense
            </button>
          </div>
        </div>
      </Card>

      {/* Transactions Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Merchant</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Account</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
              {paginatedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${tx.amount > 0 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'}`}>
                      {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div>
                      <span>{tx.merchant}</span>
                      {tx.note && <span className="block text-[10px] text-slate-400 font-normal">{tx.note}</span>}
                    </div>
                  </td>
                  <td className="py-3.5">
                    <Badge variant={tx.amount > 0 ? 'emerald' : 'slate'}>
                      {tx.category}
                    </Badge>
                  </td>
                  <td className="py-3.5 text-slate-500 dark:text-slate-400 font-medium">{tx.accountName}</td>
                  <td className="py-3.5 text-slate-500 dark:text-slate-400">{tx.date}</td>
                  <td className={`py-3.5 text-right font-bold ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {tx.amount > 0 ? `+${formatCurrency(tx.amount, userCurrency)}` : formatCurrency(tx.amount, userCurrency)}
                  </td>
                </tr>
              ))}
              {paginatedTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No transactions match your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} entries
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Transaction Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Record New Transaction"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsIncome(false)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${!isIncome ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' : 'text-slate-500'}`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => setIsIncome(true)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${isIncome ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500'}`}
            >
              Income (+)
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Merchant / Source
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Whole Foods Market"
              value={newMerchant}
              onChange={(e) => setNewMerchant(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            {!isIncome && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TransactionCategory)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {categories.filter(c => c !== 'Income').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Account
            </label>
            <select
              value={newAccountId}
              onChange={(e) => setNewAccountId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.institution})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Weekly organic shopping"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Transaction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
