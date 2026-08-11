import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/UIComponents';

interface VerifyEmailScreenProps {
  email: string;
  onVerified: () => void;
  onBackToLogin: () => void;
}

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  email,
  onVerified,
  onBackToLogin,
}) => {
  const [code, setCode] = useState<string[]>(['8', '4', '2', '9', '1', '0']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const newCode = [...code];
      pasted.forEach((char, i) => {
        if (i < 6) newCode[i] = char;
      });
      setCode(newCode);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
    }, 600);
  };

  const handleResend = () => {
    setResendTimer(45);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-8 relative z-10 text-center">
        {/* Shield Icon Header */}
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Verify Your Device
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          We sent a 6-digit secure authentication code to{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>.
        </p>

        {/* 6-Digit OTP Inputs */}
        <div className="flex justify-center gap-2 my-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 text-center text-lg font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleVerify}
          disabled={isVerifying || code.some(c => !c)}
          className="w-full"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {isVerifying ? 'Authenticating...' : 'Verify & Continue'}
        </Button>

        {/* Resend Code Link */}
        <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">
          Didn't receive the code?{' '}
          {resendTimer > 0 ? (
            <span className="font-medium text-slate-400">Resend in {resendTimer}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Resend Code
            </button>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onBackToLogin}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};
