import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SkillRadar } from '../components/SkillRadar';
import { SkillProfile, AssessmentResult } from '../types';
import {
  BarChart3,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  HelpCircle,
  ArrowRight,
  BookOpen,
  RefreshCw,
  Target
} from 'lucide-react';

interface SkillGapPageProps {
  onNavigate: (view: string) => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({ onNavigate }) => {
  const { profile, currentUser } = useAuth();
  const [skillProfile, setSkillProfile] = useState<SkillProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSkillAnalysis = async () => {
    setRefreshing(true);
    try {
      const uid = currentUser?.uid || 'guest-student-1';
      const stored = localStorage.getItem(`preppilot-assessments-${uid}`);
      const assessments: AssessmentResult[] = stored ? JSON.parse(stored) : [];

      const res = await fetch('/api/skill-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentResults: assessments,
          targetCareer: profile?.targetCareer || 'Software Developer',
          preferredLanguage: profile?.preferredLanguage || 'Python',
          userId: uid
        })
      });

      const data = await res.json();
      setSkillProfile(data);
      localStorage.setItem(`preppilot-skillprofile-${uid}`, JSON.stringify(data));
    } catch (e) {
      console.error('Skill analysis fetch error:', e);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const uid = currentUser?.uid || 'guest-student-1';
    const cached = localStorage.getItem(`preppilot-skillprofile-${uid}`);
    if (cached) {
      setSkillProfile(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchSkillAnalysis();
    }
  }, [currentUser, profile]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
              AI Skill-Gap Analyzer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Diagnostic evidence mapping your conceptual strengths, weak topics, and targeted placement priorities.
            </p>
          </div>
        </div>

        <button
          onClick={fetchSkillAnalysis}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Re-analyzing...' : 'Refresh Analysis'}
        </button>
      </div>

      {/* Main Grid: Radar + AI Reasoning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Skill Radar & Scores */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-between">
          <div className="w-full text-left mb-2">
            <h3 className="text-sm font-bold text-[#172554] dark:text-white">
              Multi-Domain Skill Distribution
            </h3>
            <span className="text-xs text-slate-500">Benchmark across 5 core placement pillars</span>
          </div>

          <SkillRadar
            aptitude={skillProfile?.aptitudeScore || 75}
            logical={skillProfile?.logicalScore || 82}
            coding={skillProfile?.codingScore || 68}
            technical={skillProfile?.technicalScore || 65}
            communication={skillProfile?.communicationScore || 80}
            size={260}
          />

          <div className="w-full mt-4 space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-500">Quantitative Aptitude</span>
              <span className="font-bold text-slate-800 dark:text-white">{skillProfile?.aptitudeScore || 75}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-500">Logical Reasoning</span>
              <span className="font-bold text-slate-800 dark:text-white">{skillProfile?.logicalScore || 82}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-500">Coding (Algorithms & Syntax)</span>
              <span className="font-bold text-slate-800 dark:text-white">{skillProfile?.codingScore || 68}%</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-50 dark:border-slate-800/60">
              <span className="text-slate-500">Technical Knowledge (OS, DBMS, Networks)</span>
              <span className="font-bold text-slate-800 dark:text-white">{skillProfile?.technicalScore || 65}%</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Communication & Behavioral</span>
              <span className="font-bold text-slate-800 dark:text-white">{skillProfile?.communicationScore || 80}%</span>
            </div>
          </div>
        </div>

        {/* Right Col: AI Explanation & Prioritized Learning Steps */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Auditor Executive Summary */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-teal-50/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-teal-950/20 border border-indigo-100 dark:border-indigo-900/60 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={16} />
              AI Auditor Synthesis
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
              {skillProfile?.aiExplanation ||
                'Your performance shows sound algorithmic foundation in linear data structures, but identified bottlenecks in non-linear dynamic programming state transitions and low-level memory paradigms.'}
            </p>
          </div>

          {/* Strong vs Weak Topics Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Validated Strengths
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {(skillProfile?.strongTopics || ['Object-Oriented Programming', 'Blood Relations', 'Percentages & Ratios']).map((topic, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Knowledge Gaps */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle size={16} /> Critical Skill Gaps
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {(skillProfile?.weakTopics || ['Dynamic Programming', 'Graph Theory', 'Primary Clustering in Hashing']).map((topic, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Repeated Mistakes Warning */}
          <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs space-y-2">
            <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle size={15} /> Repeated Test Mistakes Flagged
            </span>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 pl-4 list-disc">
              {(skillProfile?.repeatedMistakes || [
                'Overlooking worst-case asymptotic bounds in skewed Binary Search Trees',
                'Confusing open addressing collision clustering mechanisms'
              ]).map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive "Why this recommendation?" Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#172554] dark:text-white flex items-center gap-2">
              <Target size={18} className="text-indigo-600" />
              Prioritized Learning Recommendations (Explainable AI)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every suggested activity is tied directly to your empirical test performance.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {(skillProfile?.learningPriorities || []).map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {item.topic}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300">Why recommended: </strong>
                  {item.reason}
                </p>
              </div>

              <button
                onClick={() => onNavigate('coding-practice')}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Practice Topic <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
