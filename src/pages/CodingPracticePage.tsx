import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CODING_PROBLEMS } from '../server/curatedData';
import { CodingProblem, CodingSubmission } from '../types';
import confetti from 'canvas-confetti';
import {
  Code2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Terminal,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const CodingPracticePage: React.FC = () => {
  const { profile, currentUser } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem>(CODING_PROBLEMS[0]);
  const [language, setLanguage] = useState<'Python' | 'Java' | 'C'>(
    profile?.preferredLanguage === 'Python' || profile?.preferredLanguage === 'Java' || profile?.preferredLanguage === 'C'
      ? profile.preferredLanguage
      : 'Python'
  );

  const [code, setCode] = useState<string>(CODING_PROBLEMS[0].starterCode['Python']);
  const [running, setRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: string;
    passedTests: number;
    totalTests: number;
    executionTimeMs: number;
    outputLog: string;
  } | null>(null);

  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const categories = [
    'All',
    'Arrays',
    'Stacks',
    'Sorting',
    'Linked Lists',
    'Trees',
    'Dynamic Programming'
  ];

  const handleSelectProblem = (problem: CodingProblem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode[language] || problem.starterCode['Python']);
    setExecutionResult(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleLanguageChange = (lang: 'Python' | 'Java' | 'C') => {
    setLanguage(lang);
    setCode(selectedProblem.starterCode[lang] || selectedProblem.starterCode['Python']);
    setExecutionResult(null);
  };

  const handleRunCode = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/coding/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          language,
          code
        })
      });

      const data = await res.json();
      setExecutionResult(data);

      if (data.status === 'Accepted') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch (e) {
      console.error(e);
      setExecutionResult({
        status: 'Runtime Error',
        passedTests: 0,
        totalTests: selectedProblem.testCases.length,
        executionTimeMs: 0,
        outputLog: 'Failed to communicate with the code runner.'
      });
    } finally {
      setRunning(false);
    }
  };

  const filteredProblems =
    selectedCategory === 'All'
      ? CODING_PROBLEMS
      : CODING_PROBLEMS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Code2 size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
              Intelligent Coding Practice
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-frequency placement algorithms in Python, Java, and C with sandboxed test runner.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem List & Description */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Problem Select Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select Problem ({filteredProblems.length} available)
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredProblems.map((p) => {
                const isSelected = p.id === selectedProblem.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectProblem(p)}
                    className={`w-full p-2.5 rounded-lg text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{p.title}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        p.difficulty === 'Easy'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : p.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Problem Details Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedProblem.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-500">
                    Category: {selectedProblem.category}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      selectedProblem.difficulty === 'Easy'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {selectedProblem.difficulty}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedProblem.description}
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider block">
                Examples
              </span>
              {selectedProblem.examples.map((ex, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs space-y-1"
                >
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">Input:</strong> {ex.input}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">Output:</strong> {ex.output}
                  </p>
                  {ex.explanation && (
                    <p className="text-slate-500 text-[11px] font-sans italic pt-1">
                      {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider block">
                Constraints
              </span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono pl-4 list-disc">
                {selectedProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Hints & Solution accordions */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                <Lightbulb size={14} /> {showHint ? 'Hide Hint' : 'View AI Hint'}
              </button>

              <button
                type="button"
                onClick={() => setShowSolution(!showSolution)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <BookOpen size={14} /> {showSolution ? 'Hide Explanation' : 'Solution Breakdown'}
              </button>
            </div>

            {showHint && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold block">Algorithm Hint:</span>
                <ul className="pl-4 list-disc space-y-1">
                  {selectedProblem.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {showSolution && (
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1.5 leading-relaxed">
                <span className="font-bold block">Authoritative Solution Explanation:</span>
                <p>{selectedProblem.solutionExplanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Terminal */}
        <div className="lg:col-span-7 space-y-4">
          {/* Code Editor Header Controls */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Language:
              </span>
              <div className="flex items-center gap-1">
                {(['Python', 'Java', 'C'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      language === lang
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCode(selectedProblem.starterCode[language] || selectedProblem.starterCode['Python'])
                }
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                title="Reset Starter Code"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={handleRunCode}
                disabled={running}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/25 transition-all"
              >
                <Play size={14} className="fill-white" />
                {running ? 'Running Tests...' : 'Run & Test Code'}
              </button>
            </div>
          </div>

          {/* Interactive Code Editor Box */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span>Solution.{language === 'Python' ? 'py' : language === 'Java' ? 'java' : 'c'}</span>
              <span>UTF-8</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={16}
              spellCheck={false}
              className="w-full p-4 font-mono text-xs sm:text-sm bg-transparent text-slate-100 focus:outline-none resize-y selection:bg-indigo-500 selection:text-white leading-relaxed"
            />
          </div>

          {/* Execution Terminal */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Terminal size={15} />
                <span className="font-bold">Execution Output & Test Suite</span>
              </div>
              {executionResult && (
                <span
                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded ${
                    executionResult.status === 'Accepted'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {executionResult.status}
                </span>
              )}
            </div>

            {!executionResult && (
              <div className="py-6 text-center text-slate-500 text-xs">
                Click "Run & Test Code" to execute your solution against authoritative test cases.
              </div>
            )}

            {executionResult && (
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span>
                    Test Cases Passed: <strong className="text-white">{executionResult.passedTests} / {executionResult.totalTests}</strong>
                  </span>
                  <span>
                    Runtime: <strong className="text-white">{executionResult.executionTimeMs} ms</strong>
                  </span>
                </div>

                <pre className="p-3 rounded-lg bg-slate-900 text-slate-300 text-xs whitespace-pre-wrap leading-relaxed">
                  {executionResult.outputLog}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
