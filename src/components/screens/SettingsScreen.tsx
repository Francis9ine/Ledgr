import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Sun, 
  Moon, 
  Monitor, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  Sliders,
  Check
} from 'lucide-react';
import { Card, Button, Badge, ToggleSwitch, UserAvatar } from '../common/UIComponents';
import { useTheme } from '../../context/ThemeContext';
import { UserProfile, ThemeMode } from '../../types/finance';

interface SettingsScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  onUpdateUser,
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currency, setCurrency] = useState(user.currency);
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [emailNotifs, setEmailNotifs] = useState(user.emailNotifications);
  const [pushNotifs, setPushNotifs] = useState(user.pushNotifications);
  const [weeklyDigest, setWeeklyDigest] = useState(user.weeklyDigest);
  const [unusualAlerts, setUnusualAlerts] = useState(user.unusualActivityAlerts);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Synchronize state when user prop updates (e.g., from auth changes)
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setCurrency(user.currency);
    setTwoFactor(user.twoFactorEnabled);
    setEmailNotifs(user.emailNotifications);
    setPushNotifs(user.pushNotifications);
    setWeeklyDigest(user.weeklyDigest);
    setUnusualAlerts(user.unusualActivityAlerts);
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      currency,
      twoFactorEnabled: twoFactor,
      emailNotifications: emailNotifs,
      pushNotifications: pushNotifs,
      weeklyDigest,
      unusualActivityAlerts: unusualAlerts,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage personal profile, security preferences, alerts, and system theme
          </p>
        </div>
        {savedSuccess && (
          <Badge variant="emerald" className="animate-bounce">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Settings Saved!
          </Badge>
        )}
      </div>

      {/* SECTION 1: Dedicated Appearance Section */}
      <Card id="appearance-settings">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sun className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Appearance & Theme</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose your visual interface preference</p>
          </div>
        </div>

        {/* Three-Way Segmented Control */}
        <div className="grid grid-cols-3 gap-3 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 max-w-md mb-6">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              theme === 'light'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Moon className="w-4 h-4 text-emerald-400" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              theme === 'system'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>System</span>
          </button>
        </div>

        {/* Live Preview Thumbnails */}
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Live Theme Previews:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Mode Card Preview */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-slate-50 text-slate-900 ${
              resolvedTheme === 'light' && theme !== 'dark'
                ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xs">Light Mode Preview</span>
              {resolvedTheme === 'light' && <Badge variant="emerald">Active</Badge>}
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
              <div className="h-2 w-20 bg-slate-200 rounded" />
              <div className="h-4 w-32 bg-emerald-600 rounded" />
              <div className="h-1.5 w-full bg-slate-100 rounded" />
            </div>
          </div>

          {/* Dark Mode Card Preview */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-slate-900 text-white ${
              resolvedTheme === 'dark'
                ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xs">Dark Mode Preview</span>
              {resolvedTheme === 'dark' && <Badge variant="emerald">Active</Badge>}
            </div>
            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 shadow-2xs space-y-2">
              <div className="h-2 w-20 bg-slate-600 rounded" />
              <div className="h-4 w-32 bg-emerald-500 rounded" />
              <div className="h-1.5 w-full bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 2: Profile & Security */}
      <Card>
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-3">
            <UserAvatar name={name || user.name} size="lg" />
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Profile & Identity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Authenticated user session and display preferences</p>
            </div>
          </div>
          <Badge variant="emerald" className="hidden sm:inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Session
          </Badge>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Initials avatar automatically updates based on your name.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Verified Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                Active sign-in identity.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
            >
              <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
              <option value="GBP (£)">GBP (£) - British Pound</option>
              <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Security & Authentication
            </h4>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Require authenticator security code on new logins</span>
              </div>
              <ToggleSwitch
                id="two-factor-toggle"
                checked={twoFactor}
                onChange={setTwoFactor}
              />
            </div>
          </div>

          {/* Notifications Group */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-600" /> Notification Controls
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Unusual spending & fraud alerts</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">Receive instant push & email alerts when abnormal charges occur</span>
                </div>
                <ToggleSwitch
                  id="unusual-alerts-toggle"
                  checked={unusualAlerts}
                  onChange={setUnusualAlerts}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Weekly budget performance digest</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">Summary of budget allocations vs spent totals every Sunday</span>
                </div>
                <ToggleSwitch
                  id="weekly-digest-toggle"
                  checked={weeklyDigest}
                  onChange={setWeeklyDigest}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Email Notifications</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">Send account activity and monthly statements to email</span>
                </div>
                <ToggleSwitch
                  id="email-notifs-toggle"
                  checked={emailNotifs}
                  onChange={setEmailNotifs}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200">Push Notifications</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">Real-time web push notifications for card transactions</span>
                </div>
                <ToggleSwitch
                  id="push-notifs-toggle"
                  checked={pushNotifs}
                  onChange={setPushNotifs}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="primary" size="md" type="submit">
              Save All Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
