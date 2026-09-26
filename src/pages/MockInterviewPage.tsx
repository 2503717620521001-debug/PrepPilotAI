import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { InterviewMessage, InterviewSession } from '../types';
import { db, doc, setDoc } from '../lib/firebase';
import {
  Mic2,
  MicOff,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BarChart2,
  MessageSquare,
  BookOpen
} from 'lucide-react';

export const MockInterviewPage: React.FC = () => {
  const { profile, currentUser } = useAuth();

  // Setup state
  const [interviewType, setInterviewType] = useState<'HR' | 'Technical' | 'Behavioral' | 'Role-Specific'>('Technical');
  const [difficulty, setDifficulty] = useState<'Junior' | 'Mid' | 'Senior'>('Junior');
  const [sessionActive, setSessionActive] = useState(false);
  const [starting, setStarting] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputAnswer, setInputAnswer] = useState('');
  const [sending, setSending] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completedSession, setCompletedSession] = useState<InterviewSession | null>(null);

  // Optional Voice Input state (SpeechRecognition)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const handleStartInterview = async () => {
    setStarting(true);
    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewType,
          targetCareer: profile?.targetCareer || 'Software Developer',
          difficulty
        })
      });

      const data = await res.json();
      setMessages([data.firstMessage]);
      setSessionActive(true);
      setCompletedSession(null);
    } catch (e) {
      console.error(e);
    } finally {
      setStarting(false);
    }
  };

  const handleSendAnswer = async () => {
    if (!inputAnswer.trim() || sending) return;

    const studentMsg: InterviewMessage = {
      id: `msg-student-${Date.now()}`,
      role: 'student',
      content: inputAnswer.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, studentMsg];
    setMessages(updatedMessages);
    setInputAnswer('');
    setSending(true);

    try {
      const res = await fetch('/api/interview/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: updatedMessages,
          interviewType,
          targetCareer: profile?.targetCareer || 'Software Developer',
          studentAnswer: studentMsg.content
        })
      });

      const data = await res.json();
      const interviewerReply: InterviewMessage = {
        id: `msg-interviewer-${Date.now()}`,
        role: 'interviewer',
        content: data.interviewerReply,
        timestamp: new Date().toISOString(),
        feedback: data.turnFeedback
      };

      setMessages((prev) => [...prev, interviewerReply]);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleCompleteInterview = async () => {
    setCompleting(true);
    try {
      const res = await fetch('/api/interview/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationHistory: messages,
          interviewType,
          targetCareer: profile?.targetCareer || 'Software Developer'
        })
      });

      const data = await res.json();
      const sessionResult: InterviewSession = {
        id: `int-${Date.now()}`,
        userId: currentUser?.uid || 'guest-student-1',
        interviewType,
        targetCareer: profile?.targetCareer || 'Software Developer',
        difficulty,
        messages,
        overallScore: data.overallScore,
        feedback: data.feedback,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      setCompletedSession(sessionResult);
      setSessionActive(false);

      // Save to local storage & Firestore
      const uid = currentUser?.uid || 'guest-student-1';
      const stored = localStorage.getItem(`preppilot-interviews-${uid}`);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(sessionResult);
      localStorage.setItem(`preppilot-interviews-${uid}`, JSON.stringify(list));

      if (currentUser) {
        try {
          await setDoc(doc(db, 'interviews', sessionResult.id), sessionResult);
        } catch (dbErr) {
          console.warn('Interview sync error:', dbErr);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCompleting(false);
    }
  };

  // Toggle optional speech input
  const toggleListening = () => {
    if (!speechSupported) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. SETUP VIEW */}
      {!sessionActive && !completedSession && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Mic2 size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
                AI Mock Interview Simulator
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive interview practice with dynamic follow-ups, answer relevance rubrics, and STAR coaching.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2 space-y-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Select Interview Round
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['Technical', 'HR', 'Behavioral', 'Role-Specific'] as const).map((type) => {
                  const isSelected = interviewType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInterviewType(type)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-xs font-bold block">{type} Round</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {type === 'Technical'
                          ? 'Algorithms, data structures, and system design'
                          : type === 'HR'
                          ? 'Introduction, career aspirations, and cultural fit'
                          : type === 'Behavioral'
                          ? 'STAR method: leadership, conflict, and teamwork'
                          : `Domain-specific questions for ${profile?.targetCareer || 'SWE'}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Settings
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Interview Rigor
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Junior', 'Mid', 'Senior'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                        difficulty === lvl
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 leading-snug">
                <strong>Simulated Panelist:</strong> The interviewer probes your thought process, evaluates technical accuracy, and guides your communication.
              </div>

              <button
                type="button"
                disabled={starting}
                onClick={handleStartInterview}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                {starting ? 'Initializing Session...' : 'Begin Mock Interview'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE INTERVIEW SESSION */}
      {sessionActive && (
        <div className="space-y-4">
          <div className="p-4 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                {interviewType} Interview
              </span>
              <span className="text-xs text-slate-500">
                Role: <strong>{profile?.targetCareer || 'Software Developer'}</strong>
              </span>
            </div>

            <button
              onClick={handleCompleteInterview}
              disabled={completing}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              {completing ? 'Evaluating Session...' : 'Finish & View Rubric'}
            </button>
          </div>

          {/* Transcript Scroll Area */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] max-h-[500px] overflow-y-auto space-y-4 custom-scrollbar">
            {messages.map((m) => {
              const isInterviewer = m.role === 'interviewer';
              return (
                <div key={m.id} className="space-y-2">
                  <div className={`flex items-start gap-3 ${isInterviewer ? 'justify-start' : 'justify-end'}`}>
                    {isInterviewer && (
                      <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                        P
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isInterviewer
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                          : 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>

                  {/* Feedback per turn */}
                  {m.feedback && (
                    <div className="ml-11 p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 text-[11px] text-teal-900 dark:text-teal-200 flex items-center gap-4">
                      <span>Relevance: <strong>{m.feedback.relevanceScore}%</strong></span>
                      <span>Clarity: <strong>{m.feedback.clarityScore}%</strong></span>
                      {m.feedback.tips && m.feedback.tips[0] && (
                        <span className="italic text-teal-700 dark:text-teal-300">
                          Tip: {m.feedback.tips[0]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {sending && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                <span>Interviewer is evaluating your response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Answer Input Area */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <textarea
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              placeholder="Structure your answer clearly (e.g. STAR method for behavioral, or trade-offs for technical)..."
              rows={3}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

            <div className="flex items-center justify-between">
              {speechSupported ? (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isListening
                      ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                      : 'border-slate-200 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isListening ? <MicOff size={14} /> : <Mic2 size={14} />}
                  {isListening ? 'Listening...' : 'Voice Input (Optional)'}
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                disabled={!inputAnswer.trim() || sending}
                onClick={handleSendAnswer}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20"
              >
                <Send size={14} /> Submit Response
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FINAL EVALUATION REPORT */}
      {completedSession && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Interview Completed
              </span>
              <h2 className="text-2xl font-extrabold text-[#172554] dark:text-white mt-1">
                {completedSession.interviewType} Interview Evaluation Report
              </h2>
              <p className="text-xs text-slate-500">
                Overall Performance Score: <strong className="text-indigo-600 font-bold">{completedSession.overallScore}%</strong> • Total Turns: {completedSession.messages.length}
              </p>
            </div>

            <button
              onClick={() => {
                setCompletedSession(null);
                setSessionActive(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <RotateCcw size={15} /> Practice Another Interview
            </button>
          </div>

          {/* Rubric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Key Strengths
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-4 list-disc">
                {completedSession.feedback?.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle size={16} /> Growth & Practice Opportunities
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-4 list-disc">
                {completedSession.feedback?.areasForImprovement?.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Answer Structure & Coaching */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Recommended Answer Framing Framework
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {completedSession.feedback?.suggestedAnswerStructure ||
                'Lead with the direct outcome -> Clarify context and constraints -> Elaborate personal implementation actions -> Quantify impact with figures.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
