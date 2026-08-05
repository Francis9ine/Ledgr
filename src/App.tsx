import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LandingScreen } from './components/screens/LandingScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { VerifyEmailScreen } from './components/screens/VerifyEmailScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { AccountsScreen } from './components/screens/AccountsScreen';
import { TransactionsScreen } from './components/screens/TransactionsScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { BudgetGoalsScreen } from './components/screens/BudgetGoalsScreen';
import { InvestmentsScreen } from './components/screens/InvestmentsScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { HelpCenterScreen } from './components/screens/HelpCenterScreen';

import { deriveNameFromEmail } from './utils/userUtils';

import { 
  initialAccounts, 
  initialTransactions, 
  initialBudgets, 
  initialSavingsGoals, 
  initialHoldings, 
  initialInsights, 
  initialFAQs 
} from './data/mockData';

import { 
  ScreenId, 
  UserProfile, 
  Account, 
  Transaction, 
  BudgetCategory, 
  SavingsGoal, 
  Holding 
} from './types/finance';

const activeSessionEmail = 'alex.morgan@example.com';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('landing');
  const [authEmail, setAuthEmail] = useState(activeSessionEmail);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App Master State - initialized dynamically from active user session
  const [user, setUser] = useState<UserProfile>({
    name: deriveNameFromEmail(activeSessionEmail),
    email: activeSessionEmail,
    avatarUrl: '',
    joinedDate: 'August 2026',
    currency: 'INR (₹)',
    twoFactorEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    unusualActivityAlerts: true,
  });

  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(initialBudgets);
  const [goals, setGoals] = useState<SavingsGoal[]>(initialSavingsGoals);
  const [holdings] = useState<Holding[]>(initialHoldings);

  // State Mutators
  const handleAddAccount = (newAcc: Account) => {
    setAccounts(prev => [newAcc, ...prev]);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
    // Optionally update associated account balance
    setAccounts(prev => prev.map(a => {
      if (a.id === newTx.accountId) {
        return { ...a, balance: a.balance + newTx.amount };
      }
      return a;
    }));
  };

  const handleAddGoal = (newGoal: SavingsGoal) => {
    setGoals(prev => [newGoal, ...prev]);
  };

  const handleDepositGoal = (goalId: string, depositAmount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: g.currentAmount + depositAmount,
        };
      }
      return g;
    }));
  };

  const handleUpdateBudget = (id: string, newAllocated: number) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, allocated: newAllocated } : b));
  };

  const handleLoginSubmit = (email: string) => {
    const derivedName = deriveNameFromEmail(email);
    setAuthEmail(email);
    setUser(prev => ({
      ...prev,
      email,
      name: derivedName,
    }));
    setActiveScreen('verify');
  };

  const handleVerified = () => {
    setIsAuthenticated(true);
    setActiveScreen('dashboard');
  };

  const handleDirectDemo = () => {
    setIsAuthenticated(true);
    setActiveScreen('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveScreen('landing');
  };

  // Titles dictionary for header
  const screenTitles: Record<ScreenId, { title: string; subtitle?: string }> = {
    landing: { title: 'Welcome to Ledgr' },
    login: { title: 'Sign In' },
    verify: { title: 'Verify Email' },
    dashboard: { title: 'Dashboard', subtitle: 'Financial Intelligence Center' },
    accounts: { title: 'Accounts', subtitle: 'Connected Banks & Credit Lines' },
    transactions: { title: 'Transactions', subtitle: 'Real-time Activity Ledger' },
    reports: { title: 'Reports', subtitle: 'Income Velocity & Cash Flow Analysis' },
    'budget-goals': { title: 'Budget & Goals', subtitle: 'Monthly Limits & Savings Targets' },
    investments: { title: 'Investments', subtitle: 'Taxable Brokerage & Asset Allocation' },
    settings: { title: 'Settings', subtitle: 'Account Preferences & System Theme' },
    help: { title: 'Help Center', subtitle: 'Documentation & Support' },
  };

  return (
    <ThemeProvider>
      {!isAuthenticated ? (
        // Unauthenticated Flows: Landing, Login, Verify
        <>
          {activeScreen === 'landing' && (
            <LandingScreen
              onGetStarted={() => setActiveScreen('login')}
              onLogin={() => setActiveScreen('login')}
              onDirectDemo={handleDirectDemo}
            />
          )}

          {activeScreen === 'login' && (
            <LoginScreen
              onLoginSubmit={handleLoginSubmit}
              onGoToLanding={() => setActiveScreen('landing')}
              onDirectDemo={handleDirectDemo}
            />
          )}

          {activeScreen === 'verify' && (
            <VerifyEmailScreen
              email={authEmail}
              onVerified={handleVerified}
              onBackToLogin={() => setActiveScreen('login')}
            />
          )}
        </>
      ) : (
        // Authenticated Full Web App Layout with Persistent Left Sidebar
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors">
          {/* Persistent Left Sidebar */}
          <Sidebar
            activeScreen={activeScreen}
            onNavigate={(screen) => setActiveScreen(screen)}
            onLogout={handleLogout}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Main Content View Container */}
          <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
            {/* Header */}
            <Header
              title={screenTitles[activeScreen].title}
              subtitle={screenTitles[activeScreen].subtitle}
              user={user}
              onNavigate={(screen) => setActiveScreen(screen)}
              onLogout={handleLogout}
              onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            {/* Screen Content View */}
            <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
              {activeScreen === 'dashboard' && (
                <DashboardScreen
                  userName={user.name}
                  accounts={accounts}
                  transactions={transactions}
                  insights={initialInsights}
                  onNavigate={(screen) => setActiveScreen(screen)}
                  onOpenAddTransaction={() => setActiveScreen('transactions')}
                  userCurrency={user.currency}
                />
              )}

              {activeScreen === 'accounts' && (
                <AccountsScreen
                  accounts={accounts}
                  onAddAccount={handleAddAccount}
                  userCurrency={user.currency}
                />
              )}

              {activeScreen === 'transactions' && (
                <TransactionsScreen
                  transactions={transactions}
                  accounts={accounts}
                  onAddTransaction={handleAddTransaction}
                  userCurrency={user.currency}
                />
              )}

              {activeScreen === 'reports' && (
                <ReportsScreen
                  budgets={budgets}
                  userCurrency={user.currency}
                />
              )}

              {activeScreen === 'budget-goals' && (
                <BudgetGoalsScreen
                  budgets={budgets}
                  goals={goals}
                  onAddGoal={handleAddGoal}
                  onDepositGoal={handleDepositGoal}
                  onUpdateBudget={handleUpdateBudget}
                  userCurrency={user.currency}
                />
              )}

              {activeScreen === 'investments' && (
                <InvestmentsScreen
                  holdings={holdings}
                  userCurrency={user.currency}
                />
              )}

              {activeScreen === 'settings' && (
                <SettingsScreen
                  user={user}
                  onUpdateUser={setUser}
                />
              )}

              {activeScreen === 'help' && (
                <HelpCenterScreen
                  faqs={initialFAQs}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}
