import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Question, AssessmentResult, AssessmentCategory } from '../types';
import { db, doc, setDoc, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface AssessmentsPageProps {
  onNavigate: (view: string) => void;
}

export const AssessmentsPage: React.FC<AssessmentsPageProps> = ({ onNavigate }) => {
  const { profile, currentUser } = useAuth();

  // Test setup state
  const [selectedCategory, setSelectedCategory] = useState<AssessmentCategory | 'Comprehensive Diagnostic'>('Quantitative Aptitude');
  const [selectedLevel, setSelectedLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [timerEnabled, setTimerEnabled] = useState(true);

  // Active test state
  const [inProgress, setInProgress] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes default
  const [submitting, setSubmitting] = useState(false);

  // Result state
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const categories: (AssessmentCategory | 'Comprehensive Diagnostic')[] = [
    'Comprehensive Diagnostic',
    'Quantitative Aptitude',
    'Logical Reasoning',
    'Programming',
    'Data Structures and Algorithms',
    'Technical Knowledge',
    'Communication'
  ];

  // Start assessment handler
  const handleStartTest = async () => {
    setLoadingQuestions(true);
    try {
      const res = await fetch('/api/diagnostic/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory === 'Comprehensive Diagnostic' ? 'Programming' : selectedCategory,
          level: selectedLevel,
          targetCareer: profile?.targetCareer || 'Software Developer',
          branch: profile?.branch || 'Computer Science and Engineering',
          count: selectedCategory === 'Comprehensive Diagnostic' ? 6 : 5
        })
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setUserAnswers({});
        setSecondsRemaining(data.questions.length * 90); // 1.5 min per question
        setInProgress(true);
        setResult(null);
      }
    } catch (e) {
      console.error('Failed to load questions:', e);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Timer effect
  React.useEffect(() => {
    if (!inProgress || !timerEnabled) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [inProgress, timerEnabled, userAnswers, questions]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedIndex: userAnswers[q.id] !== undefined ? userAnswers[q.id] : -1
      }));

      const res = await fetch('/api/diagnostic/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions,
          userAnswers: formattedAnswers,
          category: selectedCategory,
          level: selectedLevel,
          timeSpentSeconds: questions.length * 90 - secondsRemaining,
          userId: currentUser?.uid || 'guest-student-1'
        })
      });

      const evalResult: AssessmentResult = await res.json();
      setResult(evalResult);
      setInProgress(false);

      // Persist result to Firestore & local storage
      const uid = currentUser?.uid || 'guest-student-1';
      const stored = localStorage.getItem(`preppilot-assessments-${uid}`);
      const list: AssessmentResult[] = stored ? JSON.parse(stored) : [];
      list.unshift(evalResult);
      localStorage.setItem(`preppilot-assessments-${uid}`, JSON.stringify(list));

      if (currentUser) {
        try {
          await setDoc(doc(db, 'assessments', evalResult.id), evalResult);
        } catch (dbErr) {
          console.warn('Failed to sync assessment to Firestore:', dbErr);
        }
      }
    } catch (e) {
      console.error('Failed to submit evaluation:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. SETUP VIEW */}
      {!inProgress && !result && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <ClipboardCheck size={24} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
                  AI Placement Diagnostic Assessment
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Authoritative, server-scored evaluations tailored to your target career role ({profile?.targetCareer || 'Software Developer'}).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category Selector */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Select Assessment Category
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold block">{cat}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {cat === 'Comprehensive Diagnostic'
                          ? 'All-round placement readiness test'
                          : `High-yield ${cat} placement questions`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test Configuration Settings */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Configuration
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(lvl)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                        selectedLevel === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Timed Assessment
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={timerEnabled}
                  onChange={(e) => setTimerEnabled(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 text-[11px] text-teal-800 dark:text-teal-300 space-y-1">
                <span className="font-bold block">Authoritative Scoring Guarantee:</span>
                Answer options are randomized and responses are submitted to the server for tamper-proof validation.
              </div>

              <button
                type="button"
                disabled={loadingQuestions}
                onClick={handleStartTest}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                {loadingQuestions ? 'Generating Questions...' : 'Start Assessment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE TEST RUNNER */}
      {inProgress && currentQ && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {currentQ.category}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Topic: <strong className="text-slate-700 dark:text-white">{currentQ.topic}</strong>
              </span>
            </div>

            {timerEnabled && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${
                  secondsRemaining < 60
                    ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Clock size={14} />
                <span>
                  {Math.floor(secondsRemaining / 60)}:
                  {String(secondsRemaining % 60).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar & Question Indices */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-1.5">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    currentIndex === idx
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : userAnswers[q.id] !== undefined
                      ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Answered: {answeredCount}/{questions.length}
            </span>
          </div>

          {/* Question Display Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h3>

              {currentQ.codeSnippet && (
                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                const letter = String.fromCharCode(65 + optIdx);
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm font-medium">{option}</span>
                  </div>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 disabled:opacity-30"
              >
                <ArrowLeft size={16} /> Previous
              </button>

              <div className="flex items-center gap-3">
                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(currentIndex + 1)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Next Question <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSubmitTest}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/25 transition-all"
                  >
                    <CheckCircle2 size={16} />
                    {submitting ? 'Submitting...' : 'Submit Assessment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DETAILED RESULTS VIEW */}
      {result && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Assessment Completed
              </span>
              <h2 className="text-2xl font-extrabold text-[#172554] dark:text-white mt-1">
                {result.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Score: {result.score}% • Correct: {result.correctCount} / {result.totalQuestions} • Time Spent: {result.timeSpentSeconds}s
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setResult(null)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw size={15} /> Retake Test
              </button>
              <button
                onClick={() => onNavigate('skill-analysis')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                <BarChart3 size={15} /> View Skill-Gap Analysis
              </button>
            </div>
          </div>

          {/* Topic-Level Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(result.topicBreakdown).map(([topicName, stats]) => (
              <div
                key={topicName}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                    {topicName}
                  </span>
                  <span
                    className={`text-xs font-extrabold ${
                      stats.percentage >= 70 ? 'text-teal-600' : 'text-rose-600'
                    }`}
                  >
                    {stats.percentage}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      stats.percentage >= 70 ? 'bg-teal-600' : 'bg-rose-500'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-2 block">
                  {stats.correct} of {stats.total} correct
                </span>
              </div>
            ))}
          </div>

          {/* Detailed Question Review with Explanations */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#172554] dark:text-white">
              Detailed Question Review & Explanations
            </h3>

            <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
              {questions.map((q, idx) => {
                const ans = result.userAnswers.find((a) => a.questionId === q.id);
                const isCorrect = ans ? ans.isCorrect : false;
                const userSelected = ans ? ans.selectedIndex : -1;

                return (
                  <div key={q.id} className="pt-5 first:pt-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 shrink-0 px-2 py-0.5 rounded text-[11px] font-bold ${
                            isCorrect
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          Q{idx + 1} • {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    {/* Options list showing user vs correct */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isCorrectOption = optIdx === q.correctAnswerIndex;
                        const isUserChoice = optIdx === userSelected;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg border flex items-center justify-between ${
                              isCorrectOption
                                ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 text-teal-900 dark:text-teal-200 font-semibold'
                                : isUserChoice && !isCorrect
                                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-900 dark:text-rose-200'
                                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span>
                              <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                            </span>
                            {isCorrectOption && (
                              <span className="text-[10px] text-teal-700 font-bold">
                                Correct Answer
                              </span>
                            )}
                            {isUserChoice && !isCorrect && (
                              <span className="text-[10px] text-rose-600 font-bold">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Authoritative Explanation */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                        Authoritative Explanation:
                      </span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
