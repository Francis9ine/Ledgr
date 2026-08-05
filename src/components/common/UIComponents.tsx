import React from 'react';
import { TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { getInitials } from '../../utils/userUtils';

// Toggle Switch Component (Pill-style rounded toggle switch)
export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm';
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onChange(!checked);
      }}
      className={`inline-flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
        className={`
          relative inline-flex shrink-0 rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900
          ${isSm ? 'h-5 w-9' : 'h-6 w-11'}
          ${checked ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block transform rounded-full bg-white shadow-md ring-0 
            transition duration-200 ease-in-out
            ${isSm ? 'h-4 w-4' : 'h-5 w-5'}
            ${checked ? (isSm ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'}
          `}
        />
      </button>
      {(label || description) && (
        <div className="select-none">
          {label && <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">{label}</span>}
          {description && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{description}</span>}
        </div>
      )}
    </div>
  );
};

// Dynamic Initials User Avatar Component
export const UserAvatar: React.FC<{
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ name, size = 'md', className = '' }) => {
  const initials = getInitials(name);

  const sizeStyles = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-9 h-9 text-xs font-bold',
    lg: 'w-11 h-11 text-sm font-extrabold',
    xl: 'w-14 h-14 text-lg font-extrabold',
  };

  return (
    <div
      className={`
        rounded-full bg-emerald-600 dark:bg-emerald-500 text-white 
        flex items-center justify-center shrink-0 shadow-xs select-none tracking-tight
        ${sizeStyles[size]} ${className}
      `}
      title={name}
    >
      {initials}
    </div>
  );
};

// Card Container
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}> = ({ children, className = '', onClick, id }) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800/90 
        border border-slate-200/80 dark:border-slate-700/60 
        rounded-xl shadow-xs hover:shadow-sm 
        transition-all duration-200 p-5
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Stat Summary Card
export interface StatCardProps {
  id?: string;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon,
}) => {
  return (
    <Card id={id} className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">{value}</h3>
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            {icon}
          </div>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${
                changeType === 'positive'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : changeType === 'negative'
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {changeType === 'positive' && <TrendingUp className="w-3 h-3" />}
              {changeType === 'negative' && <TrendingDown className="w-3 h-3" />}
              {changeType === 'neutral' && <Minus className="w-3 h-3" />}
              {change}
            </span>
          )}
          {subtitle && <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
};

// Sleek Button Component
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs font-semibold gap-2',
    lg: 'px-6 py-2.5 text-sm font-semibold gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-xs focus:ring-emerald-500/50',
    secondary: 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-slate-500/50',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500/50',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-rose-500/50',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500/50',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

// Badge Pill
export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate' | 'purple';
  className?: string;
}> = ({ children, variant = 'slate', className = '' }) => {
  const styles = {
    emerald: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40',
    blue: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/40',
    amber: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40',
    rose: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/40',
    purple: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/40',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Sleek Progress Bar
export const ProgressBar: React.FC<{
  value: number; // 0 - 100
  colorClass?: string;
  heightClass?: string;
  showPercent?: boolean;
}> = ({ value, colorClass = 'bg-emerald-600 dark:bg-emerald-500', heightClass = 'h-2', showPercent = false }) => {
  const safeValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-full">
      <div className={`w-full bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {showPercent && (
        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block font-medium">
          {safeValue.toFixed(0)}% Complete
        </span>
      )}
    </div>
  );
};

// Modal Overlay Dialog
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
};
