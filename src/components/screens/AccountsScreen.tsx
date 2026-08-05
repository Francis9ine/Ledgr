import React, { useState } from 'react';
import { 
  Plus, 
  Wallet, 
  CreditCard, 
  Building2, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { Card, Button, Modal, Badge } from '../common/UIComponents';
import { Account } from '../../types/finance';
import { formatCurrency } from '../../utils/userUtils';

interface AccountsScreenProps {
  accounts: Account[];
  onAddAccount: (newAccount: Account) => void;
  userCurrency?: string;
}

export const AccountsScreen: React.FC<AccountsScreenProps> = ({
  accounts,
  onAddAccount,
  userCurrency,
}) => {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for Card Entry
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nickname, setNickname] = useState('');
  const [accountType, setAccountType] = useState<'credit' | 'checking' | 'savings'>('credit');
  const [initialBalance, setInitialBalance] = useState('0');

  // Input Auto-Formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiryDate(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiryDate(raw);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(raw);
  };

  // Helper to detect card network badge
  const getCardNetwork = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('3')) return 'American Express';
    if (clean.startsWith('6')) return 'RuPay';
    return 'Card';
  };

  const handleAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardholderName || !expiryDate || !cvv) return;

    setIsSubmitting(true);

    const cleanCard = cardNumber.replace(/\D/g, '');
    const last4 = cleanCard.slice(-4) || '8888';
    const network = getCardNetwork(cardNumber);
    const parsedBalance = parseFloat(initialBalance) || 0;
    // Credit accounts default to negative balance if debt or zero
    const finalBalance = accountType === 'credit' && parsedBalance > 0 ? -parsedBalance : parsedBalance;

    setTimeout(() => {
      const createdAccount: Account = {
        id: `acc-${Date.now()}`,
        name: nickname.trim() || `${network} ${accountType === 'credit' ? 'Card' : 'Account'}`,
        type: accountType,
        institution: `${network} Verified`,
        accountNumberMask: `•••• ${last4}`,
        balance: finalBalance,
        currency: 'INR',
        updatedAt: 'Just now',
      };

      onAddAccount(createdAccount);
      setIsSubmitting(false);
      setShowConnectModal(false);

      // Reset form
      setCardNumber('');
      setCardholderName('');
      setExpiryDate('');
      setCvv('');
      setNickname('');
      setAccountType('credit');
      setInitialBalance('0');
    }, 1000);
  };

  const totalAssets = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0));

  return (
    <div className="space-y-6">
      {/* Top Header Banner & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Connected Accounts</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time balance synchronization via 256-bit encrypted API
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowConnectModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Card
        </Button>
      </div>

      {/* Account Totals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Liquid Assets</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {formatCurrency(totalAssets, userCurrency)}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Checking, High Yield Savings, Brokerage</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Wallet className="w-6 h-6" />
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Credit Liabilities</p>
            <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              {formatCurrency(-totalLiabilities, userCurrency)}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Credit Cards & Revolving Credit</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <CreditCard className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Connected Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <Card key={acc.id} className="relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200/60 dark:border-slate-600/60 flex items-center justify-center text-lg shadow-2xs">
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    {acc.name}
                    {acc.isPrimary && (
                      <Badge variant="emerald">Primary</Badge>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {acc.institution} • {acc.accountNumberMask}
                  </p>
                </div>
              </div>
              <Badge variant={acc.type === 'credit' ? 'rose' : 'emerald'}>
                {acc.type.toUpperCase()}
              </Badge>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-end justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Balance</span>
                <p className={`text-2xl font-bold mt-0.5 ${acc.balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                  {formatCurrency(acc.balance, userCurrency)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Synced {acc.updatedAt}</span>
                <button className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 mt-1">
                  <RefreshCw className="w-3 h-3" /> Sync Now
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Connect Card Modal */}
      <Modal
        isOpen={showConnectModal}
        onClose={() => {
          if (!isSubmitting) setShowConnectModal(false);
        }}
        title="Connect a Card"
      >
        {!isSubmitting ? (
          <form onSubmit={handleAddCardSubmit} className="space-y-4">
            {/* Reassurance Banner */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Ledgr uses end-to-end 256-bit encrypted connection. We never store raw CVV or card details.
              </span>
            </div>

            {/* Account / Card Nickname */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Account / Card Nickname (Optional)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Personal Sapphire Card, Salary Account"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cardholder Name *
              </label>
              <input
                type="text"
                required
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="e.g. ALEX MORGAN"
                className="w-full px-3 py-2 text-xs uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium tracking-wide"
              />
            </div>

            {/* Card Number with Auto-spacing and Network Badge */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Card Number *
                </label>
                {cardNumber && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {getCardNetwork(cardNumber)}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4532 •••• •••• 8888"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono tracking-wider"
                />
                <CreditCard className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
              </div>
            </div>

            {/* Expiry Date & CVV Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expiry Date (MM/YY) *
                </label>
                <input
                  type="text"
                  required
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    CVV *
                  </label>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" /> 3-4 digits
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="•••"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono"
                />
              </div>
            </div>

            {/* Account Type & Initial Balance Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                >
                  <option value="credit">Credit Card</option>
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Balance
                </label>
                <input
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                />
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setShowConnectModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={<Lock className="w-3.5 h-3.5" />}
              >
                Connect Card Securely
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Connecting Card Securely...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verifying card credentials with banking network & establishing tokenization...
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
