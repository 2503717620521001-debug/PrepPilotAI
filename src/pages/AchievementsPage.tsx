import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AchievementBadge } from '../types';
import { Award, Flame, CheckCircle2, Star, Zap, Target, BookOpen } from 'lucide-react';

export const AchievementsPage: React.FC = () => {
  const { profile } = useAuth();

  const badges: AchievementBadge[] = [
    {
      id: 'b-1',
      key: 'diagnostic_pioneer',
      title: 'Diagnostic Pioneer',
      description: 'Completed your first comprehensive placement diagnostic assessment.',
      icon: '🎯',
      isUnlocked: true,
      unlockedAt: '3 days ago'
    },
    {
      id: 'b-2',
      key: 'streak_master',
      title: 'Consistency Champion',
      description: 'Maintained a 4-day consecutive active study streak.',
      icon: '🔥',
      isUnlocked: (profile?.currentStreak || 1) >= 4,
      unlockedAt: 'Yesterday'
    },
    {
      id: 'b-3',
      key: 'dsa_solver',
      title: 'Algorithmic Strategist',
      description: 'Submitted code passing all test cases in the coding sandbox.',
      icon: '💻',
      isUnlocked: true,
      unlockedAt: '2 days ago'
    },
    {
      id: 'b-4',
      key: 'mock_star',
      title: 'STAR Communicator',
      description: 'Completed a full mock interview with relevance score above 80%.',
      icon: '🎙️',
      isUnlocked: true,
      unlockedAt: '1 day ago'
    },
    {
      id: 'b-5',
      key: 'roadmap_milestone',
      title: 'Roadmap Voyager',
      description: 'Completed 5 roadmap milestone exercises without skipping.',
      icon: '🗺️',
      isUnlocked: true,
      unlockedAt: 'Today'
    },
    {
      id: 'b-6',
      key: 'resume_optimized',
      title: 'ATS Resume Ready',
      description: 'Optimized resume text to reach an ATS match percentage above 75%.',
      icon: '📄',
      isUnlocked: true,
      unlockedAt: 'Today'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Award size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
              Student Learning Milestones & Streaks
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rewarding consistent study habits, deliberate practice, and objective problem-solving growth.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 font-bold text-xs">
          <Flame size={16} className="fill-amber-500 text-amber-500" />
          <span>{profile?.currentStreak || 1} Day Active Streak</span>
        </div>
      </div>

      {/* Daily Goal & Streak Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Daily Placement Goal
            </span>
            <h3 className="text-xl font-bold mt-1">
              Complete {profile?.dailyStudyTimeMinutes || 90} Minutes of Focused Preparation
            </h3>
          </div>
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-xs font-semibold">
            Progress Today: 45 / {profile?.dailyStudyTimeMinutes || 90}m (50%)
          </div>
        </div>

        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
          <div className="bg-teal-400 h-full rounded-full" style={{ width: '50%' }} />
        </div>

        <p className="text-xs text-indigo-200">
          💡 Genuine consistency beats last-minute cramming. 45 minutes daily builds permanent algorithmic retention.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
          Earned Badges ({badges.filter((b) => b.isUnlocked).length} / {badges.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all ${
                badge.isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {badge.icon}
                </span>
                {badge.isUnlocked ? (
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    Locked
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {badge.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                {badge.description}
              </p>

              {badge.unlockedAt && (
                <span className="text-[10px] text-slate-400 block pt-2 border-t border-slate-100 dark:border-slate-800">
                  Achieved: {badge.unlockedAt}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
