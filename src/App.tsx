import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { DashboardPage } from './pages/DashboardPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { CodingPracticePage } from './pages/CodingPracticePage';
import { MockInterviewPage } from './pages/MockInterviewPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';
import { CompanyPrepPage } from './pages/CompanyPrepPage';
import { CareerExplorerPage } from './pages/CareerExplorerPage';
import { PerformanceReportPage } from './pages/PerformanceReportPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { TutorPage } from './pages/TutorPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

import { Menu, Flame, User, Sparkles } from 'lucide-react';

function AppContent() {
  const { currentUser, profile, loading, isGuest } = useAuth();

  // Root view: 'landing' | 'auth-login' | 'auth-register' | 'dashboard'
  const [rootView, setRootView] = useState<'landing' | 'auth-login' | 'auth-register' | 'dashboard'>('landing');

  // Dashboard active sub-tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user is logged in or guest, determine if onboarding is needed
  const isAuthenticated = !!currentUser || isGuest;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Loading PrepPilot AI...
          </span>
        </div>
      </div>
    );
  }

  // 1. Unauthenticated Visitor Flow (Protected Routes Guard)
  if (!isAuthenticated) {
    if (rootView === 'auth-login' || rootView === 'auth-register') {
      return (
        <AuthPage
          initialMode={rootView === 'auth-login' ? 'login' : 'register'}
          onSuccess={() => setRootView('dashboard')}
          onBackToHome={() => setRootView('landing')}
        />
      );
    }

    // Default to Landing Page for unauthenticated visitors (dashboard is protected)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar onNavigate={(view) => setRootView(view as any)} activeView={rootView} />
        <main className="flex-1">
          <LandingPage onNavigate={(view) => setRootView(view as any)} />
        </main>
        <Footer onNavigate={(view) => {
          if (view === 'landing') setRootView('landing');
          else setRootView('auth-login');
        }} />
      </div>
    );
  }

  // 2. Authenticated but Needs Onboarding
  if (profile && !profile.isOnboarded) {
    return <OnboardingWizard onComplete={() => setRootView('dashboard')} />;
  }

  // 3. Authenticated Student Dashboard Workspace
  const renderDashboardView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'assessments':
        return <AssessmentsPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'skill-analysis':
        return <SkillGapPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'roadmap':
        return <RoadmapPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'coding-practice':
        return <CodingPracticePage />;
      case 'mock-interviews':
        return <MockInterviewPage />;
      case 'resume-analyzer':
        return <ResumeAnalyzerPage />;
      case 'company-prep':
        return <CompanyPrepPage />;
      case 'career-explorer':
        return <CareerExplorerPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'progress-reports':
        return <PerformanceReportPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'achievements':
        return <AchievementsPage />;
      case 'tutor':
        return <TutorPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 overflow-hidden font-sans">
      {/* Persistent Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">
                PrepPilot AI •
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#172554] dark:text-white capitalize">
                {activeTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('tutor')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
            >
              <Sparkles size={14} /> AI Assistant
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {profile?.displayName?.[0] || 'S'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-bold text-slate-800 dark:text-white leading-tight">
                    {profile?.displayName || 'Student'}
                  </p>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">
                    {profile?.targetCareer || 'Software Developer'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          {renderDashboardView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
