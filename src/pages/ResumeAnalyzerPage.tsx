import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ResumeAnalysisResult } from '../types';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ResumeAnalyzerPage: React.FC = () => {
  const { profile } = useAuth();

  const [resumeText, setResumeText] = useState('');
  const [targetJob, setTargetJob] = useState(
    `${profile?.targetCareer || 'Software Developer'} (Campus Graduate Level)`
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleResume = `ALEX CHEN
alex.chen@college.edu | +91 98765 43210 | linkedin.com/in/alexchen-eng | github.com/alexchen-dev

EDUCATION
National Institute of Engineering, B.Tech in Computer Science and Engineering (2021 - 2025)
CGPA: 8.6 / 10.0

TECHNICAL SKILLS
Languages: Python, Java, C++, SQL, JavaScript
Frameworks & Databases: Node.js, Express, React, PostgreSQL, MongoDB, Git, Docker
Core Concepts: Data Structures and Algorithms, Object-Oriented Programming, DBMS, Operating Systems

PROJECTS
Campus Resource & Placement Portal (React, Node.js, PostgreSQL)
- Developed a web application for engineering students to register for campus placement rounds.
- Built authentication with JWT and created API endpoints for resumes and applications.
- Created database queries to filter candidate eligibility based on GPA and backlogs.

Distributed Algorithmic Task Queue (Python, Redis, Docker)
- Implemented an asynchronous background worker in Python using Redis streams.
- Supported concurrent task execution with retries and exponential backoff.
- Wrote unit tests and containerized the service using Docker.

EXTRACURRICULARS & ACHIEVEMENTS
- Finalist, Smart India Hackathon
- Solved 250+ algorithmic problems across LeetCode and CodeChef`;

  const handleLoadSample = () => {
    setResumeText(sampleResume);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read plain text directly or read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetJobDescription: targetJob
        })
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyDraft = () => {
    if (!result?.improvedSummaryDraft) return;
    navigator.clipboard.writeText(result.improvedSummaryDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
              AI Placement Resume Analyzer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ATS keyword optimization, action-verb restructuring, and project bullet point enhancements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-teal-600 font-medium">
          <ShieldCheck size={16} /> Zero Fabricated Skills
        </div>
      </div>

      {/* Input Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Job Role or Company Description
            </label>
            <input
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-end justify-between">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors">
              <Upload size={15} /> Upload Resume (.txt/.md)
              <input
                type="file"
                accept=".txt,.md,.json,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Load Sample Resume
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Paste Resume Content
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={8}
            placeholder="Paste your resume text here, including skills, projects, and coursework..."
            className="w-full p-4 font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />
        </div>

        <button
          type="button"
          disabled={!resumeText.trim() || analyzing}
          onClick={handleAnalyze}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles size={16} />
          {analyzing ? 'Analyzing ATS Keywords & Structure...' : 'Analyze Resume'}
        </button>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                ATS Match Score
              </span>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                {result.atsScore}%
              </p>
              <span className="text-[11px] text-teal-600 font-semibold">
                High Match for {targetJob.slice(0, 25)}
              </span>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Identified Core Skills
              </span>
              <p className="text-3xl font-black text-teal-600 mt-2">
                {result.identifiedSkills.length}
              </p>
              <span className="text-[11px] text-slate-400 font-medium">
                Verified from resume text
              </span>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Missing Priority Keywords
              </span>
              <p className="text-3xl font-black text-rose-600 mt-2">
                {result.missingKeywords.length}
              </p>
              <span className="text-[11px] text-rose-500 font-medium">
                Recommended to incorporate
              </span>
            </div>
          </div>

          {/* Keywords Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Verified Skills Present
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {result.identifiedSkills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-xs font-medium border border-teal-200 dark:border-teal-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle size={16} /> Missing Job-Related Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords.map((k, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-800"
                  >
                    + {k}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Project Bullet Point Rewrite Critique */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#172554] dark:text-white uppercase tracking-wider">
              Project Bullet Point Rewrites (Action Verbs & Quantitative Metrics)
            </h3>

            <div className="space-y-4">
              {result.projectCritique.map((critique, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2 text-xs"
                >
                  <span className="font-bold text-slate-800 dark:text-white block">
                    {critique.title}
                  </span>

                  <div className="p-2.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 line-through">
                    <strong>Before: </strong> {critique.originalBullet}
                  </div>

                  <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-medium">
                    <strong>Optimized: </strong> {critique.improvedBullet}
                  </div>

                  <p className="text-slate-500 text-[11px] italic">
                    💡 Impact: {critique.metricSuggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Improved Summary Draft */}
          {result.improvedSummaryDraft && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#172554] dark:text-white uppercase tracking-wider">
                  Recommended Professional Summary Draft
                </h3>
                <button
                  onClick={handleCopyDraft}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  {copied ? <Check size={14} className="text-teal-600" /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Draft'}
                </button>
              </div>

              <p className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "{result.improvedSummaryDraft}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
