import React, { useState } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  MapPin,
  Code2,
  Mic2,
  FileText,
  Compass,
  Building2,
  TrendingUp,
  Award,
  Bot,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Moon,
  Sun,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile
}) => {
  const { profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assessments', label: 'Assessments', icon: ClipboardCheck },
    { id: 'skill-analysis', label: 'Skill Analysis', icon: BarChart3 },
    { id: 'roadmap', label: 'My Roadmap', icon: MapPin },
    { id: 'coding-practice', label: 'Coding Practice', icon: Code2 },
    { id: 'mock-interviews', label: 'Mock Interviews', icon: Mic2 },
    { id: 'resume-analyzer', label: 'Resume Analyzer', icon: FileText },
    { id: 'company-prep', label: 'Company Prep', icon: Building2 },
    { id: 'career-explorer', label: 'Career Explorer', icon: Compass },
    { id: 'progress-reports', label: 'Progress Reports', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'tutor', label: 'AI Tutor Assistant', icon: Bot },
  ];

  const bottomItems = [
    { id: 'profile', label: 'Student Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#172554] text-slate-200 select-none">
      {/* Brand Header */}
      <div className={`flex items-center justify-between p-4 border-b border-blue-900/60 ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Logo size="sm" showTagline={false} />
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            P
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-blue-900/80 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Student Badge / Quick Info */}
      {!collapsed && (
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-blue-950/70 border border-blue-800/40">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">
                {profile?.displayName || 'Student'}
              </p>
              <p className="text-[11px] text-teal-400 font-medium truncate">
                {profile?.targetCareer || 'Software Developer'}
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Flame size={13} className="text-amber-400 fill-amber-400" />
              <span>{profile?.currentStreak || 1}d</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        <div className="pt-3 my-2 border-t border-blue-900/60"></div>

        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/50'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-blue-900/60 flex items-center justify-between gap-2">
        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-blue-900/50 transition-colors ${
            collapsed ? 'w-full justify-center' : ''
          }`}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {!collapsed && (
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-900/30 transition-colors"
            title="Sign Out"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block h-screen sticky top-0 transition-all duration-300 z-30 shadow-xl ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
