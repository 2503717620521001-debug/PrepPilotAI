import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Heart, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

export const Footer: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" showTagline={true} />
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Empowering engineering students with adaptive AI assessments, targeted skill-gap roadmaps, and verified placement preparation tools.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-medium">
              <ShieldCheck size={16} />
              <span>Zero Fabricated Results • Privacy-First</span>
            </div>
          </div>

          {/* Col 2: Core Modules */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Preparation Modules</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate?.('assessments')} className="hover:text-indigo-400 transition-colors">
                  AI Diagnostic Assessment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('skill-analysis')} className="hover:text-indigo-400 transition-colors">
                  Skill-Gap Radar & Prioritization
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('roadmap')} className="hover:text-indigo-400 transition-colors">
                  7 to 60-Day Adaptive Roadmaps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('coding-practice')} className="hover:text-indigo-400 transition-colors">
                  DSA & Algorithm Practice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('mock-interviews')} className="hover:text-indigo-400 transition-colors">
                  AI Mock Interview Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Tools */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Student Tools</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate?.('resume-analyzer')} className="hover:text-indigo-400 transition-colors">
                  ATS Resume Keyword Optimizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('company-prep')} className="hover:text-indigo-400 transition-colors">
                  Company Placement Tracks (TCS, Google, etc.)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('career-explorer')} className="hover:text-indigo-400 transition-colors">
                  Career Explorer (VLSI, Embedded, SWE)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('progress-reports')} className="hover:text-indigo-400 transition-colors">
                  Before-and-After PDF Reports
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate?.('tutor')} className="hover:text-indigo-400 transition-colors">
                  AI Placement Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Hackathon Notes */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">Academic & Hackathon Info</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Crafted for GDG Prompt Wars Hackathon. Built on Google Gemini 3, Firebase Cloud Firestore & Auth, React 19, and Tailwind CSS.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
              <span className="font-semibold text-teal-400 block mb-1">Ethical Preparation Notice:</span>
              Assessments benchmark conceptual mastery and problem-solving readiness. We never guarantee employment outcomes or fabricate placement statistics.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PrepPilot AI. Assess. Learn. Practice. Improve.</p>
          <div className="flex items-center gap-6">
            <span>Inter Font • Tailwind CSS</span>
            <span>WCAG 2.2 AA Compliant</span>
            <span>GDG Prompt Wars</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
