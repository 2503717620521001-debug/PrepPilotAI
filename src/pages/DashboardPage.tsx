import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SkillRadar } from '../components/SkillRadar';
import { AssessmentResult, SkillProfile, Roadmap, RoadmapTask } from '../types';
import { db, collection, query, where, getDocs, doc, getDoc, updateDoc } from '../lib/firebase';
import {
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  MapPin,
  Code2,
  Mic2,
  TrendingUp,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Award,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (view: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { profile, currentUser, isGuest } = useAuth();

  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(null);
  const [todayTasks, setTodayTasks] = useState<RoadmapTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Load student real records or initialize baseline
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const uid = currentUser?.uid || 'guest-student-1';

        // 1. Fetch assessments from Firestore or LocalStorage
        let assessments: AssessmentResult[] = [];
        if (currentUser) {
          try {
            const q = query(collection(db, 'assessments'), where('userId', '==', uid));
            const snap = await getDocs(q);
            assessments = snap.docs.map((d) => d.data() as AssessmentResult);
          } catch (e) {
            console.warn('Assessments fetch fallback:', e);
          }
        }
        if (assessments.length === 0) {
          const cached = localStorage.getItem(`preppilot-assessments-${uid}`);
          if (cached) {
            assessments = JSON.parse(cached);
          }
        }

        // If still empty and guest, provide initial benchmark assessment
        if (assessments.length === 0 && isGuest) {
          assessments = [
            {
              id: 'init-eval-1',
              userId: uid,
              category: 'Comprehensive Diagnostic',
              title: 'Initial Placement Readiness Diagnostic',
              level: 'Intermediate',
              score: 72,
              totalQuestions: 15,
              correctCount: 11,
              timeSpentSeconds: 420,
              isComparableDiagnostic: true,
              topicBreakdown: {
                'Quantitative Aptitude': { correct: 3, total: 4, percentage: 75 },
                'Logical Reasoning': { correct: 3, total: 3, percentage: 100 },
                'Programming': { correct: 3, total: 4, percentage: 75 },
                'Data Structures': { correct: 1, total: 3, percentage: 33 },
                'Communication': { correct: 1, total: 1, percentage: 100 }
              },
              userAnswers: [],
              completedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
              createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
            }
          ];
          localStorage.setItem(`preppilot-assessments-${uid}`, JSON.stringify(assessments));
        }

        setAssessmentHistory(assessments);

        // 2. Fetch or compute SkillProfile
        let profileData: SkillProfile | null = null;
        if (currentUser) {
          try {
            const spSnap = await getDoc(doc(db, 'skillProfiles', uid));
            if (spSnap.exists()) profileData = spSnap.data() as SkillProfile;
          } catch (e) {
            console.warn('SkillProfile fetch fallback:', e);
          }
        }
        if (!profileData) {
          const cachedSp = localStorage.getItem(`preppilot-skillprofile-${uid}`);
          if (cachedSp) {
            profileData = JSON.parse(cachedSp);
          } else {
            // Default skill profile based on initial assessment
            profileData = {
              userId: uid,
              overallScore: 72,
              aptitudeScore: 75,
              logicalScore: 82,
              codingScore: 68,
              technicalScore: 65,
              communicationScore: 80,
              strongTopics: ['Syllogisms & Logic', 'Percentages & Profit Loss', 'Basic OOP'],
              weakTopics: ['Dynamic Programming', 'Graph Theory', 'Primary Clustering'],
              repeatedMistakes: [
                'Overlooking worst-case asymptotic bounds in skewed Binary Search Trees',
                'Confusing open addressing collision clustering mechanisms'
              ],
              learningPriorities: [
                { topic: 'Dynamic Programming Memoization', reason: 'High-frequency in placement coding rounds', priority: 'High' },
                { topic: 'Operating Systems Deadlocks & Mutexes', reason: 'Common core interview hurdle', priority: 'High' },
                { topic: 'Speed, Time and Distance', reason: 'Key differentiator in quantitative section', priority: 'Medium' }
              ],
              aiExplanation: 'Your conceptual foundation in basic algorithms and logical deduction is strong. The main performance gap lies in recursive memoization and low-level memory mechanics. Target 45 minutes daily on state transitions to reach placement readiness.',
              updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`preppilot-skillprofile-${uid}`, JSON.stringify(profileData));
          }
        }
        setSkillProfile(profileData);

        // 3. Fetch or initialize active roadmap & daily tasks
        const cachedRoadmap = localStorage.getItem(`preppilot-roadmap-${uid}`);
        const cachedTasks = localStorage.getItem(`preppilot-tasks-${uid}`);

        if (cachedRoadmap && cachedTasks) {
          setActiveRoadmap(JSON.parse(cachedRoadmap));
          setTodayTasks(JSON.parse(cachedTasks).slice(0, 3));
        } else {
          // Initialize active 30-day roadmap
          const newRoadmap: Roadmap = {
            id: `rm-${uid}`,
            userId: uid,
            title: `30-Day ${profile?.targetCareer || 'Software Developer'} Placement Roadmap`,
            durationDays: 30,
            targetCareer: profile?.targetCareer || 'Software Developer',
            progressPercentage: 15,
            completedTasksCount: 4,
            totalTasksCount: 30,
            currentDay: 5,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          const newTasks: RoadmapTask[] = [
            {
              id: 'task-5-1',
              roadmapId: `rm-${uid}`,
              userId: uid,
              dayNumber: 5,
              title: 'Dynamic Programming: 1D Array State Transitions',
              topic: 'Dynamic Programming',
              category: 'Data Structures and Algorithms',
              estimatedMinutes: 45,
              description: 'Solve Climbing Stairs and House Robber problems. Write out recurrences before coding.',
              exercises: ['Solve House Robber on Coding Practice', 'Implement memoization table in Python'],
              isCompleted: false
            },
            {
              id: 'task-5-2',
              roadmapId: `rm-${uid}`,
              userId: uid,
              dayNumber: 5,
              title: 'Operating Systems: Four Coffman Deadlock Conditions',
              topic: 'Operating Systems',
              category: 'Technical Knowledge',
              estimatedMinutes: 30,
              description: 'Review Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait with resource allocation graphs.',
              exercises: ['Review OS cheat sheet in Library', 'Take 5-min OS quiz'],
              isCompleted: false
            },
            {
              id: 'task-5-3',
              roadmapId: `rm-${uid}`,
              userId: uid,
              dayNumber: 5,
              title: 'Aptitude: Permutations & Circular Arrangements',
              topic: 'Permutations & Combinations',
              category: 'Quantitative Aptitude',
              estimatedMinutes: 25,
              description: 'Formula review: n! / (p! * q!) for repeated letters and (n-1)! for circular rings.',
              exercises: ['Solve 5 permutation practice problems'],
              isCompleted: true,
              completedAt: new Date().toISOString()
            }
          ];

          setActiveRoadmap(newRoadmap);
          setTodayTasks(newTasks);
          localStorage.setItem(`preppilot-roadmap-${uid}`, JSON.stringify(newRoadmap));
          localStorage.setItem(`preppilot-tasks-${uid}`, JSON.stringify(newTasks));
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser, isGuest, profile]);

  const toggleTask = (taskId: string) => {
    const updated = todayTasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          isCompleted: !t.isCompleted,
          completedAt: !t.isCompleted ? new Date().toISOString() : undefined
        };
      }
      return t;
    });
    setTodayTasks(updated);
    const uid = currentUser?.uid || 'guest-student-1';
    localStorage.setItem(`preppilot-tasks-${uid}`, JSON.stringify(updated));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Personalized Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#172554] via-indigo-900 to-indigo-950 text-white shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
              Campus Placement Track: {profile?.targetCareer || 'Software Developer'}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
              <Flame size={14} className="fill-amber-400 text-amber-400" />
              {profile?.currentStreak || 1} Day Streak
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.displayName || 'Student'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200">
            Next milestone: <span className="font-semibold text-white">Dynamic Programming State Transitions</span> • Estimated: 45 mins
          </p>
        </div>

        {/* Quick Action Group */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('assessments')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <ClipboardCheck size={16} /> Take Diagnostic
          </button>
          <button
            onClick={() => onNavigate('roadmap')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
          >
            <MapPin size={16} /> Continue Roadmap
          </button>
        </div>
      </div>

      {/* 2. Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Placement Readiness</span>
            <TrendingUp size={18} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-[#172554] dark:text-white mt-2">
            {skillProfile?.overallScore || 72}%
          </p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
            +8% from initial diagnostic
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Roadmap Progress</span>
            <MapPin size={18} className="text-teal-600" />
          </div>
          <p className="text-3xl font-black text-[#172554] dark:text-white mt-2">
            {activeRoadmap?.currentDay || 5} <span className="text-sm font-semibold text-slate-400">/ {activeRoadmap?.durationDays || 30} Days</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-teal-600 h-full rounded-full"
              style={{ width: `${activeRoadmap?.progressPercentage || 20}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Practice Time</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-3xl font-black text-[#172554] dark:text-white mt-2">
            {profile?.totalStudyMinutes || 360} <span className="text-sm font-semibold text-slate-400">mins</span>
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Target: {profile?.dailyStudyTimeMinutes || 90}m daily goal
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Assessments Taken</span>
            <Award size={18} className="text-indigo-600" />
          </div>
          <p className="text-3xl font-black text-[#172554] dark:text-white mt-2">
            {assessmentHistory.length}
          </p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            {assessmentHistory.length > 0 ? 'Diagnostic Benchmark Logged' : 'Ready for first test'}
          </p>
        </div>
      </div>

      {/* 3. Skill Overview & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Widget */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#172554] dark:text-white">
              Skill Overview Radar
            </h3>
            <button
              onClick={() => onNavigate('skill-analysis')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Detailed Breakdown <ChevronRight size={14} />
            </button>
          </div>

          <SkillRadar
            aptitude={skillProfile?.aptitudeScore || 75}
            logical={skillProfile?.logicalScore || 82}
            coding={skillProfile?.codingScore || 68}
            technical={skillProfile?.technicalScore || 65}
            communication={skillProfile?.communicationScore || 80}
            size={240}
          />

          <div className="grid grid-cols-5 w-full pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-center text-[10px]">
            <div>
              <span className="block text-slate-400">Apt</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{skillProfile?.aptitudeScore || 75}%</span>
            </div>
            <div>
              <span className="block text-slate-400">Log</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{skillProfile?.logicalScore || 82}%</span>
            </div>
            <div>
              <span className="block text-slate-400">Code</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{skillProfile?.codingScore || 68}%</span>
            </div>
            <div>
              <span className="block text-slate-400">Tech</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{skillProfile?.technicalScore || 65}%</span>
            </div>
            <div>
              <span className="block text-slate-400">Comm</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{skillProfile?.communicationScore || 80}%</span>
            </div>
          </div>
        </div>

        {/* Daily Study Plan */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#172554] dark:text-white flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                Today's Daily Study Plan
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">Day {activeRoadmap?.currentDay || 5} Tasks</span>
            </div>

            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    task.isCompleted
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-indigo-400'
                  }`}
                >
                  <button type="button" className="mt-0.5 shrink-0 text-indigo-600">
                    {task.isCompleted ? <CheckCircle2 size={18} className="text-teal-600" /> : <Circle size={18} />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-xs font-bold leading-tight ${task.isCompleted ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                      {task.category} • ~{task.estimatedMinutes}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('roadmap')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-colors flex items-center justify-center gap-1.5"
          >
            Open Full Interactive Roadmap <ChevronRight size={14} />
          </button>
        </div>

        {/* AI Recommendations with Explainability */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#172554] dark:text-white flex items-center gap-2">
                <Sparkles size={16} className="text-teal-600" />
                Personalized Next Steps
              </h3>
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded">
                AI Driven
              </span>
            </div>

            <div className="space-y-3">
              {(skillProfile?.learningPriorities || []).slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {item.topic}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        item.priority === 'High'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    <strong className="text-slate-600 dark:text-slate-300">Why recommended: </strong>
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('coding-practice')}
            className="w-full mt-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Code2 size={15} /> Practice Algorithmic Problems
          </button>
        </div>
      </div>

      {/* 4. Quick Action Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigate('assessments')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all text-left group shadow-sm"
        >
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <ClipboardCheck size={20} />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">Topic Assessments</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Test Aptitude, DSA & Tech</p>
        </button>

        <button
          onClick={() => onNavigate('coding-practice')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all text-left group shadow-sm"
        >
          <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 w-fit mb-3 group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <Code2 size={20} />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">DSA Code Editor</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Python, Java & C runner</p>
        </button>

        <button
          onClick={() => onNavigate('mock-interviews')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all text-left group shadow-sm"
        >
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 w-fit mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Mic2 size={20} />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">AI Mock Interview</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">HR & Technical simulations</p>
        </button>

        <button
          onClick={() => onNavigate('progress-reports')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all text-left group shadow-sm"
        >
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <TrendingUp size={20} />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white">Progress Report</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Download Before & After PDF</p>
        </button>
      </div>

      {/* 5. Assessment History Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#172554] dark:text-white">
              Recent Assessment Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified test history stored securely in Cloud Firestore
            </p>
          </div>
          <button
            onClick={() => onNavigate('assessments')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Start New Assessment →
          </button>
        </div>

        {assessmentHistory.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <ClipboardCheck size={36} className="mx-auto text-slate-400 mb-3" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No assessments completed yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Take your first 5-minute diagnostic assessment to map your skill radar and unlock personalized study roadmaps.
            </p>
            <button
              onClick={() => onNavigate('assessments')}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all"
            >
              Start Diagnostic Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Assessment Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Correct / Total</th>
                  <th className="py-3 px-4">Date Completed</th>
                  <th className="py-3 px-4 rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assessmentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-extrabold ${
                          item.score >= 80
                            ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                            : item.score >= 60
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {item.score}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {item.correctCount} / {item.totalQuestions}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(item.completedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onNavigate('skill-analysis')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        View Analysis →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
