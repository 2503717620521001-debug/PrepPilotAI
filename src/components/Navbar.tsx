import React, { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, ArrowRight, LayoutDashboard, UserCheck } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeView }) => {
  const { profile, currentUser, isGuest, continueAsGuest } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!currentUser || isGuest;

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <button onClick={() => handleNavClick('landing')} className="cursor-pointer text-left focus:outline-none">
          <Logo size="md" showTagline={false} />
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('landing')}
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              activeView === 'landing' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Home
          </button>
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => handleNavClick('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all shadow-indigo-600/20"
            >
              <LayoutDashboard size={16} />
              Open Dashboard
              <ArrowRight size={15} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => continueAsGuest('Software Developer')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Instant Demo Access without credentials"
              >
                <UserCheck size={14} className="text-teal-600" />
                Instant Demo
              </button>

              <button
                onClick={() => handleNavClick('auth-login')}
                className="px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('auth-register')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all shadow-indigo-600/25"
              >
                Get Started
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('landing')}
            className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            Home
          </button>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            How It Works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-medium text-slate-700 dark:text-slate-200"
          >
            FAQ
          </a>
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {isLoggedIn ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold"
              >
                <LayoutDashboard size={16} /> Open Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    continueAsGuest('Software Developer');
                    handleNavClick('dashboard');
                  }}
                  className="w-full py-2.5 rounded-xl border border-teal-600 text-teal-700 dark:text-teal-400 font-semibold"
                >
                  Explore as Demo Student
                </button>
                <button
                  onClick={() => handleNavClick('auth-login')}
                  className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('auth-register')}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
