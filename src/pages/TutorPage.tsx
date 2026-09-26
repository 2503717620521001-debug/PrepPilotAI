import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Code2,
  BookOpen,
  Lightbulb,
  RefreshCw,
  AlertCircle,
  RotateCcw,
  Copy,
  Check,
  Compass,
  ArrowRight,
  BrainCircuit,
  GraduationCap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'student' | 'tutor';
  content: string;
  timestamp: string;
  isError?: boolean;
  errorCode?: string;
  retryPrompt?: string;
  modelUsed?: string;
}

export const TutorPage: React.FC = () => {
  const { profile } = useAuth();

  const initialWelcome = `Hello ${profile?.displayName || 'there'}! 👋 I am your **PrepPilot AI Learning Assistant**, specialized in campus placement preparation for **${profile?.targetCareer || 'Software Developer'}** roles.

You can ask me to:
• **Explain complex algorithms** (e.g., Dynamic Programming, Graph Traversal, Binary Search)
• **Solve Quantitative & Logical Aptitude questions** with shortcut techniques
• **Debug code snippets** or analyze time and space complexity ($O(n \\log n)$, $O(1)$)
• **Master Core Engineering** (Operating Systems, DBMS ACID properties, Computer Networks)
• **Recommend study milestones** tailored to your identified weak areas

What topic or problem would you like to tackle today?`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'tutor',
      content: initialWelcome,
      timestamp: new Date().toISOString()
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | 'DSA' | 'Aptitude' | 'Core' | 'WeakAreas'>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const rawText = (textToSend || input).trim();
    if (!rawText || loading) return;

    // Prevent submitting while another request is in flight
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'student',
      content: rawText,
      timestamp: new Date().toISOString()
    };

    // Filter out previous error cards from the prompt history sent to Gemini
    const validHistory = messages
      .filter((m) => !m.isError)
      .map((m) => ({
        role: m.role,
        content: m.content
      }));

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...validHistory, { role: 'student', content: rawText }],
          studentContext: {
            targetCareer: profile?.targetCareer || 'Software Developer',
            preferredLanguage: profile?.preferredLanguage || 'Python',
            weakSubjects: profile?.weakSubjects || [],
            prepLevel: profile?.prepLevel || 'Intermediate'
          }
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'tutor',
          content: data.error || 'The AI Tutor encountered an error processing your query.',
          timestamp: new Date().toISOString(),
          isError: true,
          errorCode: data.code || 'UNKNOWN_ERROR',
          retryPrompt: rawText
        };
        setMessages((prev) => [...prev, errorMsg]);
        return;
      }

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        role: 'tutor',
        content: data.reply || 'Let me help you break that down further.',
        timestamp: data.timestamp || new Date().toISOString(),
        modelUsed: data.modelUsed
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (e: any) {
      console.error('Tutor chat network error:', e);
      const networkErrorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'tutor',
        content: 'Unable to connect to the PrepPilot AI Tutor service. Please verify your connection or try again.',
        timestamp: new Date().toISOString(),
        isError: true,
        errorCode: 'NETWORK_ERROR',
        retryPrompt: rawText
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const categorizedPrompts = {
    All: [
      'How do I identify whether a problem needs Dynamic Programming or Greedy approach?',
      'Explain the difference between Process and Thread with memory layouts',
      'What shortcut formulas should I remember for Speed, Time, and Distance aptitude?',
      'How should I structure my answer for behavioral questions using STAR?'
    ],
    DSA: [
      'Explain the difference between recursion memoization and iterative tabulation with an example',
      `Write a clean implementation of Binary Search in ${profile?.preferredLanguage || 'Python'} and explain edge cases`,
      'When should I use BFS vs DFS in tree and graph problems for placements?',
      'Explain how Hash Map open addressing collision resolution works'
    ],
    Aptitude: [
      'Show me the quickest trick to solve Work and Time problems involving multiple workers',
      'How do I calculate compound interest quickly without an engineering calculator?',
      'What is the formula for Permutations vs Combinations with identical items?',
      'Explain blood relation problems with a family tree diagram approach'
    ],
    Core: [
      'Explain the 4 Coffman conditions for Deadlock and how Operating Systems prevent them',
      'What are ACID properties in DBMS and why is Isolation level important?',
      'Walk me through the TCP 3-Way Handshake step by step with SYN and ACK flags',
      'What is the difference between monolithic architecture and microservices for campus interviews?'
    ],
    WeakAreas: (profile?.weakSubjects && profile.weakSubjects.length > 0)
      ? profile.weakSubjects.map((sub) => `Give me a step-by-step masterclass and placement practice plan for ${sub}`)
      : [
          'What are the highest-weightage topics asked in campus placement technical rounds?',
          'How can I structure my daily 90-minute preparation schedule for optimum placement readiness?'
        ]
  };

  const currentPrompts = categorizedPrompts[activeCategory] || categorizedPrompts.All;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#172554] dark:text-white">
                PrepPilot AI Learning Tutor
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online & Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Personalized mentor for <strong className="text-slate-700 dark:text-slate-300">{profile?.targetCareer || 'Software Developer'}</strong> • Language: <strong className="text-slate-700 dark:text-slate-300">{profile?.preferredLanguage || 'Python'}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile?.weakSubjects && profile.weakSubjects.length > 0 && (
            <button
              onClick={() => {
                setActiveCategory('WeakAreas');
                handleSend(`Based on my target role (${profile.targetCareer}) and identified weak areas (${profile.weakSubjects?.join(', ')}), what is the single most important concept I should master today?`);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors border border-indigo-200/60 dark:border-indigo-800/60"
            >
              <BrainCircuit size={14} />
              Target Weak Areas
            </button>
          )}

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome-reset',
                  role: 'tutor',
                  content: 'Chat history cleared. How can I help you with your campus placement preparation?',
                  timestamp: new Date().toISOString()
                }
              ])
            }
            title="Reset conversation history"
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isTutor = msg.role === 'tutor';
          const isErr = msg.isError;

          if (isErr) {
            return (
              <div key={msg.id} className="flex items-start gap-3 justify-start max-w-[90%]">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <AlertCircle size={18} />
                </div>
                <div className="rounded-2xl p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 text-xs sm:text-sm space-y-2">
                  <div className="font-semibold flex items-center gap-1.5">
                    <span>Tutor Service Notice</span>
                    {msg.errorCode && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-200/60 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300">
                        {msg.errorCode}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{msg.content}</p>
                  {msg.retryPrompt && (
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleSend(msg.retryPrompt)}
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                      >
                        <RotateCcw size={13} />
                        Retry Question
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                  <Bot size={18} />
                </div>
              )}

              <div className="max-w-[85%] space-y-1.5">
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    isTutor
                      ? 'bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-200/60 dark:border-slate-750'
                      : 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>

                {isTutor && (
                  <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Copy explanation"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check size={12} className="text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Follow-up shortcut pills */}
                      <button
                        onClick={() => handleSend('Can you explain that more simply with an intuitive real-world analogy?')}
                        disabled={loading}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        • Explain simpler
                      </button>

                      <button
                        onClick={() => handleSend(`Show me a clean, commented code example for this in ${profile?.preferredLanguage || 'Python'}.`)}
                        disabled={loading}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        • Code example
                      </button>
                    </div>

                    {msg.modelUsed && (
                      <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!isTutor && (
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  <User size={16} />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              <Bot size={18} />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 border border-slate-200/60 dark:border-slate-750">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
              </span>
              <span>Analyzing placement concepts and preparing explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Category Pills & Suggested Quick Prompts */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/30 p-2 sm:px-4 space-y-2">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Compass size={12} /> Topics:
          </span>
          {(['All', 'DSA', 'Aptitude', 'Core', 'WeakAreas'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              {cat === 'WeakAreas' ? '🎯 My Weak Areas' : cat}
            </button>
          ))}
        </div>

        {/* Suggestion Prompts */}
        <div className="overflow-x-auto flex items-center gap-2 pb-1">
          {currentPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0 transition-colors disabled:opacity-40"
            >
              {p.slice(0, 48)}...
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            placeholder={loading ? 'Tutor is typing response...' : 'Ask about algorithms, aptitude formulas, OS/DBMS concepts, or paste code to debug...'}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send Message"
            className="p-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 text-xs font-semibold"
          >
            <span>Ask</span>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
