export type ScreenId = 
  | 'landing'
  | 'login'
  | 'verify'
  | 'dashboard'
  | 'accounts'
  | 'transactions'
  | 'reports'
  | 'budget-goals'
  | 'investments'
  | 'settings'
  | 'help';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  institution: string;
  accountNumberMask: string;
  balance: number;
  currency: string;
  updatedAt: string;
  isPrimary?: boolean;
}

export type TransactionCategory = 
  | 'Housing'
  | 'Groceries'
  | 'Dining'
  | 'Shopping'
  | 'Transportation'
  | 'Utilities'
  | 'Entertainment'
  | 'Income'
  | 'Investments'
  | 'Healthcare'
  | 'Subscribed Services'
  | 'Transfer';

export interface Transaction {
  id: string;
  merchant: string;
  logoUrl?: string;
  category: TransactionCategory;
  amount: number; // positive for income, negative for expenses
  date: string;
  accountId: string;
  accountName: string;
  status: 'completed' | 'pending';
  note?: string;
}

export interface BudgetCategory {
  id: string;
  category: TransactionCategory;
  allocated: number;
  spent: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'Housing' | 'Emergency' | 'Travel' | 'Vehicle' | 'Education' | 'Other';
  iconName: string;
  monthlyContribution: number;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  allocationPercent: number;
  type: 'Stock' | 'ETF' | 'Crypto' | 'Bond';
  dayChangePercent: number;
}

export interface FinancialInsight {
  id: string;
  type: 'tip' | 'warning' | 'opportunity' | 'ai';
  title: string;
  description: string;
  actionText?: string;
  actionScreen?: ScreenId;
  date: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Security' | 'Accounts' | 'Investments' | 'Budgeting';
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  joinedDate: string;
  currency: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  unusualActivityAlerts: boolean;
}
