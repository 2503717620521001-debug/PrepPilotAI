import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, Send, User, Sparkles, Code2, BookOpen, Lightbulb, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'student' | 'tutor';
  content: string;
  timestamp: string;
}

export const TutorPage: React.FC = () => {
  const { profile } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'tutor',
      content: `Hello ${profile?.displayName || 'there'}! 👋 I am your PrepPilot AI Learning Assistant. 

I'm here to help you prepare for campus placement drives for **${profile?.targetCareer || 'Software Developer'}** roles.

You can ask me to:
• **Explain complex algorithms** (e.g., Dynamic Programming memoization vs tabulation)
• **Debug code snippets** or analyze runtime/space complexity
• **Review theoretical questions** (OS Coffman conditions, DBMS ACID properties, TCP handshakes)
• **Guide your daily roadmap milestones** and explain recent test errors

What topic shall we explore today?`,
      timestamp: new Date().toISOString()
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'student',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          studentContext: {
            targetCareer: profile?.targetCareer,
            preferredLanguage: profile?.preferredLanguage,
            weakSubjects: profile?.weakSubjects
          }
        })
      });

      const data = await res.json();
      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        role: 'tutor',
        content: data.reply || 'Let me help you break that down further.',
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (e) {
      console.error('Tutor chat error:', e);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'tutor',
          content: 'Unable to connect to the tutor service. Please verify your connection or try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I identify whether a problem needs Dynamic Programming or Greedy approach?',
    'Explain the difference between Process and Thread with memory layouts',
    'Write a quick Python implementation of binary search and explain edge cases',
    'How should I structure my answer for behavioral questions using STAR?'
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#172554] dark:text-white flex items-center gap-2">
              PrepPilot AI Learning Assistant
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Personalized mentor for {profile?.targetCareer || 'Software Developer'} • Powered by Gemini
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome-reset',
                role: 'tutor',
                content: 'Chat history cleared. How can I help you with your placement preparation?',
                timestamp: new Date().toISOString()
              }
            ])
          }
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
        >
          <RefreshCw size={13} /> Clear Chat
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => {
          const isTutor = msg.role === 'tutor';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isTutor ? 'justify-start' : 'justify-end'}`}
            >
              {isTutor && (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                  AI
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isTutor
                    ? 'bg-slate-100/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                    : 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'
                }`}
              >
                {msg.content}
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
              AI
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
              </span>
              <span>Reasoning step by step...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/20 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Suggested:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 hover:border-indigo-500 shrink-0 transition-colors"
          >
            {p.slice(0, 45)}...
          </button>
        ))}
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
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about concepts, algorithm complexities, or debug code..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-all shadow-md shadow-indigo-600/20"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
