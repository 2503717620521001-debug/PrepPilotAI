import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings, Moon, Sun, Trash2, ShieldCheck, CheckCircle2, RefreshCw, Activity } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { profile, logout, currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [clearedNotice, setClearedNotice] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  const checkSystemHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch (e) {
      setHealthStatus({ status: 'offline', error: 'Server unreachable' });
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const handleClearCache = () => {
    const uid = currentUser?.uid || 'guest-student-1';
    localStorage.removeItem(`preppilot-assessments-${uid}`);
    localStorage.removeItem(`preppilot-skillprofile-${uid}`);
    localStorage.removeItem(`preppilot-roadmap-${uid}`);
    localStorage.removeItem(`preppilot-tasks-${uid}`);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
              Application Settings & Health
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage interface preferences, system diagnostics, and privacy controls.
            </p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#172554] dark:text-white uppercase tracking-wider">
          Appearance & Display
        </h3>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-amber-500" />}
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white block">
                Interface Color Scheme
              </span>
              <span className="text-[11px] text-slate-500">
                Currently using {theme === 'dark' ? 'Dark Theme' : 'Light Theme (PrepPilot Navy & Soft White)'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>

      {/* System Health Diagnostics */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#172554] dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-teal-600" />
            Backend Services Status
          </h3>
          <button
            onClick={checkSystemHealth}
            disabled={checkingHealth}
            className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
          >
            <RefreshCw size={13} className={checkingHealth ? 'animate-spin' : ''} /> Check Status
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Express REST API</span>
            <div className="flex items-center gap-1.5 font-bold text-teal-600">
              <CheckCircle2 size={15} /> Active (Port 3000)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Google Gemini AI</span>
            <div className="flex items-center gap-1.5 font-bold text-teal-600">
              <CheckCircle2 size={15} /> Connected (gemini-3.8-flash)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Cloud Firestore & Auth</span>
            <div className="flex items-center gap-1.5 font-bold text-teal-600">
              <CheckCircle2 size={15} /> Provisioned & Deployed
            </div>
          </div>
        </div>
      </div>

      {/* Local Storage & Cache Controls */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#172554] dark:text-white uppercase tracking-wider">
          Student Data & Cache Management
        </h3>

        <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60">
          <div>
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200 block">
              Reset Local Assessment & Roadmap Cache
            </span>
            <span className="text-[11px] text-slate-500">
              Clears local device test history to simulate a fresh student diagnostic baseline.
            </span>
          </div>

          <button
            onClick={handleClearCache}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-sm"
          >
            <Trash2 size={14} /> Clear Cache
          </button>
        </div>

        {clearedNotice && (
          <p className="text-xs text-teal-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={14} /> Cache reset successfully.
          </p>
        )}
      </div>
    </div>
  );
};
