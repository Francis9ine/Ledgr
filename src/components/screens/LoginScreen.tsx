import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { Button, Modal, ToggleSwitch } from '../common/UIComponents';
import { getEmailError, validateEmailFully } from '../../utils/Emailvalidation';

interface LoginScreenProps {
  onLoginSubmit: (email: string) => void;
  onGoToLanding: () => void;
  onDirectDemo: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSubmit,
  onGoToLanding,
  onDirectDemo,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotEmailError, setForgotEmailError] = useState<string | null>(null);
  const [forgotEmailTouched, setForgotEmailTouched] = useState(false);
  const [checkingForgotEmail, setCheckingForgotEmail] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Fast format-only check while typing/blurring
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailTouched) setEmailError(getEmailError(value));
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(getEmailError(email));
  };

  // Full check (format + real domain) on submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);

    setCheckingEmail(true);
    const validationError = await validateEmailFully(email);
    setCheckingEmail(false);

    setEmailError(validationError);
    if (validationError) return; // block submit — invalid email or fake domain

    onLoginSubmit(email);
  };

  const handleForgotEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForgotEmail(value);
    if (forgotEmailTouched) setForgotEmailError(getEmailError(value));
  };

  const handleForgotEmailBlur = () => {
    setForgotEmailTouched(true);
    setForgotEmailError(getEmailError(forgotEmail));
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotEmailTouched(true);

    setCheckingForgotEmail(true);
    const validationError = await validateEmailFully(forgotEmail);
    setCheckingForgotEmail(false);

    setForgotEmailError(validationError);
    if (validationError) return; // block submit — invalid email or fake domain

    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative transition-colors">
      {/* Soft Background Radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Main Centered Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-8 relative z-10">
        {/* Brand Logo & Header */}
        <div className="text-center mb-6">
          <button 
            onClick={onGoToLanding}
            className="inline-flex items-center gap-2.5 mb-3 focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <span className="font-bold text-xl">L</span>
            </div>
            <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">Ledgr</span>
          </button>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your credentials to access your secure dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="you@example.com"
                className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                  emailError
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/50'
                }`}
              />
            </div>
            {emailError && (
              <p className="text-[11px] text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotEmailError(null);
                  setForgotEmailTouched(false);
                  setResetSent(false);
                  setShowForgotPassword(true);
                }}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <ToggleSwitch
              id="remember-me-toggle"
              size="sm"
              checked={rememberMe}
              onChange={setRememberMe}
              label="Remember this browser"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            disabled={checkingEmail}
            icon={checkingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          >
            {checkingEmail ? 'Checking email...' : 'Sign In & Continue'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onGoToLanding}
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Get Started Free
            </button>
          </p>
        </div>
      </div>

      {/* Security Footer */}
      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Secured with 256-Bit Bank Level Encryption</span>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        title="Reset Your Password"
      >
        {!resetSent ? (
          <form onSubmit={handleForgotSubmit} className="space-y-4" noValidate>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Enter the email address associated with your account, and we'll send a secure password reset link.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={handleForgotEmailChange}
                onBlur={handleForgotEmailBlur}
                className={`w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                  forgotEmailError
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/50'
                }`}
              />
              {forgotEmailError && (
                <p className="text-[11px] text-red-500 mt-1">{forgotEmailError}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setShowForgotPassword(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" disabled={checkingForgotEmail}>
                {checkingForgotEmail ? 'Checking...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Reset Email Sent!</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We sent instructions to <span className="font-semibold text-slate-800 dark:text-slate-200">{forgotEmail}</span>.
            </p>
            <Button variant="primary" size="sm" className="mt-2" onClick={() => setShowForgotPassword(false)}>
              Back to Login
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};