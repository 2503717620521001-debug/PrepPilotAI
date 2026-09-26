import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Roadmap, RoadmapTask } from '../types';
import { db, doc, setDoc, updateDoc } from '../lib/firebase';
import confetti from 'canvas-confetti';
import {
  MapPin,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  AlertCircle,
  RefreshCw,
  Check,
  X,
  Layers,
  ChevronRight
} from 'lucide-react';

interface RoadmapPageProps {
  onNavigate: (view: string) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate }) => {
  const { profile, currentUser } = useAuth();

  const [duration, setDuration] = useState<7 | 15 | 30 | 60>(
    (profile?.targetDurationDays as any) || 30
  );
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filterDay, setFilterDay] = useState<number | 'all'>('all');
  const [adjustmentNotice, setAdjustmentNotice] = useState<{
    reason: string;
    newFocusTopic: string;
    adjustedDays: number;
  } | null>(null);

  const fetchOrGenerateRoadmap = async (targetDuration: number) => {
    setGenerating(true);
    try {
      const uid = currentUser?.uid || 'guest-student-1';
      const res = await fetch('/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCareer: profile?.targetCareer || 'Software Developer',
          durationDays: targetDuration,
          weakTopics: profile?.weakSubjects || ['Dynamic Programming', 'Graph Theory'],
          dailyMinutes: profile?.dailyStudyTimeMinutes || 90,
          preferredLanguage: profile?.preferredLanguage || 'Python',
          userId: uid
        })
      });

      const data = await res.json();
      setRoadmap(data.roadmap);
      setTasks(data.tasks);

      localStorage.setItem(`preppilot-roadmap-${uid}`, JSON.stringify(data.roadmap));
      localStorage.setItem(`preppilot-tasks-${uid}`, JSON.stringify(data.tasks));

      if (currentUser) {
        try {
          await setDoc(doc(db, 'roadmaps', data.roadmap.id), data.roadmap);
        } catch (e) {
          console.warn('Roadmap sync error:', e);
        }
      }
    } catch (e) {
      console.error('Roadmap generate error:', e);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const uid = currentUser?.uid || 'guest-student-1';
    const cachedRoadmap = localStorage.getItem(`preppilot-roadmap-${uid}`);
    const cachedTasks = localStorage.getItem(`preppilot-tasks-${uid}`);

    if (cachedRoadmap && cachedTasks) {
      setRoadmap(JSON.parse(cachedRoadmap));
      setTasks(JSON.parse(cachedTasks));
      setLoading(false);
    } else {
      fetchOrGenerateRoadmap(duration);
    }

    // Check for adaptive adjustment proposal
    const latestAssessmentsStr = localStorage.getItem(`preppilot-assessments-${uid}`);
    if (latestAssessmentsStr) {
      try {
        const assessments = JSON.parse(latestAssessmentsStr);
        if (assessments.length > 1) {
          const latest = assessments[0];
          if (latest.score < 60) {
            setAdjustmentNotice({
              reason: `Your latest score in ${latest.category} was ${latest.score}%. An adaptive adjustment is available to allocate 2 additional review days.`,
              newFocusTopic: `Remedial ${latest.category} Drills`,
              adjustedDays: 32
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [currentUser]);

  const handleToggleTask = (taskId: string) => {
    let completedCount = 0;
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.isCompleted;
        if (nextState) {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.8 }
          });
        }
        return {
          ...t,
          isCompleted: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined
        };
      }
      return t;
    });

    updated.forEach((t) => {
      if (t.isCompleted) completedCount++;
    });

    const progressPercentage = Math.round((completedCount / updated.length) * 100);

    setTasks(updated);
    if (roadmap) {
      const updatedRoadmap: Roadmap = {
        ...roadmap,
        completedTasksCount: completedCount,
        progressPercentage,
        updatedAt: new Date().toISOString()
      };
      setRoadmap(updatedRoadmap);

      const uid = currentUser?.uid || 'guest-student-1';
      localStorage.setItem(`preppilot-roadmap-${uid}`, JSON.stringify(updatedRoadmap));
      localStorage.setItem(`preppilot-tasks-${uid}`, JSON.stringify(updated));
    }
  };

  const displayedTasks = filterDay === 'all' ? tasks : tasks.filter((t) => t.dayNumber === filterDay);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header with Duration Switcher */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
            <MapPin size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
              Adaptive Placement Preparation Roadmap
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized day-by-day learning milestones tailored to {profile?.targetCareer || 'Software Developer'}.
            </p>
          </div>
        </div>

        {/* Roadmap Duration Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {([7, 15, 30, 60] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDuration(d);
                fetchOrGenerateRoadmap(d);
              }}
              disabled={generating}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                duration === d
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Adaptive Adjustment Banner */}
      {adjustmentNotice && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                Adaptive Roadmap Adjustment Suggested
              </span>
              <p className="text-slate-600 dark:text-slate-300 mt-0.5">{adjustmentNotice.reason}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setAdjustmentNotice(null);
                fetchOrGenerateRoadmap(duration);
              }}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1"
            >
              <Check size={13} /> Accept Adjustment
            </button>
            <button
              onClick={() => setAdjustmentNotice(null)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            >
              Keep Current
            </button>
          </div>
        </div>
      )}

      {/* Progress Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Roadmap Velocity & Execution
            </span>
            <h2 className="text-lg font-bold text-[#172554] dark:text-white mt-0.5">
              {roadmap?.title || `${duration}-Day Placement Roadmap`}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {roadmap?.progressPercentage || 0}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({roadmap?.completedTasksCount || 0} / {tasks.length} tasks completed)
            </span>
          </div>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${roadmap?.progressPercentage || 0}%` }}
          />
        </div>

        {/* Day Filter Pills */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterDay('all')}
            className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
              filterDay === 'all'
                ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Days ({tasks.length})
          </button>
          {Array.from(new Set(tasks.map((t) => t.dayNumber))).map((d) => (
            <button
              key={d}
              onClick={() => setFilterDay(d)}
              className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                filterDay === d
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {displayedTasks.map((task) => (
          <div
            key={task.id}
            className={`p-5 rounded-2xl border transition-all ${
              task.isCompleted
                ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggleTask(task.id)}
                  className="mt-1 shrink-0 text-indigo-600 hover:scale-110 transition-transform"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 size={22} className="text-teal-600" />
                  ) : (
                    <Circle size={22} className="text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      Day {task.dayNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {task.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock size={12} /> ~{task.estimatedMinutes} mins
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold ${
                      task.isCompleted
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Exercises list */}
                  {task.exercises && task.exercises.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Exercises & Action Items:
                      </p>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pl-4 list-disc">
                        {task.exercises.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {task.revisionNotes && (
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 italic">
                      💡 Milestone Note: {task.revisionNotes}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onNavigate('coding-practice')}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold transition-colors shrink-0"
              >
                Practice <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
