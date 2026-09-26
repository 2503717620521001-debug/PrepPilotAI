import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SkillRadar } from '../components/SkillRadar';
import {
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  BarChart3,
  MapPin,
  Mic2,
  Code2,
  FileText,
  Bot,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Play,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  Layers,
  Award
} from 'lucide-react';

export const LandingPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { currentUser, isGuest, continueAsGuest } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleStart = () => {
    if (currentUser || isGuest) {
      onNavigate('dashboard');
    } else {
      onNavigate('auth-register');
    }
  };

  const handleDemo = () => {
    continueAsGuest('Software Developer');
    onNavigate('dashboard');
  };

  const features = [
    {
      icon: ClipboardCheck,
      title: 'AI Diagnostic Assessment',
      desc: 'Adaptive diagnostic tests covering Quantitative Aptitude, Logical Reasoning, Coding, and Technical Knowledge with authoritative server-side scoring.',
      tag: 'Adaptive'
    },
    {
      icon: BarChart3,
      title: 'Intelligent Skill-Gap Analysis',
      desc: 'Pinpoints specific topic-level strengths, weak subject areas, and repeated algorithmic mistakes with explainable AI reasoning.',
      tag: 'Explainable AI'
    },
    {
      icon: MapPin,
      title: 'Personalized Learning Roadmap',
      desc: 'Dynamic 7, 15, 30, or 60-day structured study plans with daily study goals, practice exercises, and milestone reviews tailored to your available time.',
      tag: 'Dynamic'
    },
    {
      icon: Mic2,
      title: 'AI Mock Interviews',
      desc: 'Multi-turn HR, Technical, and Behavioral interview simulations with rubrics evaluating technical accuracy, clarity, and the STAR framework.',
      tag: 'Interactive'
    },
    {
      icon: Code2,
      title: 'Coding Practice',
      desc: 'Curated DSA problem suite in Python, Java, and C across Arrays, Stacks, Trees, and Dynamic Programming with execution feedback.',
      tag: 'Multi-Language'
    },
    {
      icon: FileText,
      title: 'AI Resume Analyzer',
      desc: 'Upload resumes in PDF/text to identify missing industry keywords, improve ATS match percentage, and rewrite project bullet points.',
      tag: 'ATS Optimization'
    },
    {
      icon: Bot,
      title: 'AI Learning Assistant',
      desc: 'Contextual AI placement mentor to clarify complex theoretical concepts, debug code errors step-by-step, and explain past test mistakes.',
      tag: '24/7 Tutor'
    },
    {
      icon: TrendingUp,
      title: 'Before-and-After Analytics',
      desc: 'Measure verifiable progress between initial diagnostic tests and final mock placements with downloadable PDF progress reports.',
      tag: 'Measurable'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Assess',
      desc: 'Take an adaptive diagnostic test matching your academic branch and desired career path.'
    },
    {
      number: '02',
      title: 'Analyze',
      desc: 'Our AI engine maps your skill profile and identifies specific conceptual bottlenecks and knowledge gaps.'
    },
    {
      number: '03',
      title: 'Learn',
      desc: 'Follow a day-by-day customized study roadmap with bite-sized daily objectives and targeted tutorials.'
    },
    {
      number: '04',
      title: 'Practice',
      desc: 'Solve algorithmic coding problems, simulate live mock interviews, and optimize your technical resume.'
    },
    {
      number: '05',
      title: 'Improve',
      desc: 'Retake comparable diagnostic assessments, verify measurable score gains, and download verified PDF reports.'
    }
  ];

  const faqs = [
    {
      q: 'How does PrepPilot AI personalize questions to my target role?',
      a: 'During onboarding, you specify your academic branch (e.g. CSE, ECE, EEE) and target career (e.g. Software Developer, VLSI Engineer, Embedded Systems, Data Scientist). Our system selects core technical subjects, hardware/software tradeoffs, and company-track requirements matching that exact profile.'
    },
    {
      q: 'Are assessment scores authoritative and tamper-proof?',
      a: 'Yes. All answer evaluations, question scoring, and topic breakdown calculations are executed on the server. Authoritative answer keys are never sent to the client browser prior to test completion.'
    },
    {
      q: 'Can I try PrepPilot AI immediately without registering?',
      a: 'Absolutely. Click "Instant Demo" anywhere on the site to explore the complete student dashboard, take assessments, run coding problems, and experience mock interviews in demo mode.'
    },
    {
      q: 'How does the Before-and-After Progress Report work?',
      a: 'PrepPilot AI preserves your initial baseline diagnostic assessment. When you complete later comparable assessments after working through your roadmap tasks, the system computes delta gains per topic and produces a clean, exportable PDF report.'
    },
    {
      q: 'Does PrepPilot AI execute student code safely?',
      a: 'Yes. Coding submissions are evaluated against verified algorithmic test suites with strict input sanitization, timeout controls, and execution constraints to ensure safety and reliable benchmarking.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#4F46E5_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] dark:opacity-[0.08]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
              Empowering Engineering Campus Placements
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172554] dark:text-white leading-[1.15]">
              Your Personal AI Placement <span className="text-indigo-600 dark:text-indigo-400">Preparation Companion.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#64748B] dark:text-slate-300 leading-relaxed font-normal">
              Discover your strengths, identify your skill gaps and follow a personalized learning journey designed around your career goals.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all text-base hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-all text-base shadow-sm"
              >
                <Play size={16} className="text-indigo-600 fill-indigo-600" />
                Explore Live Demo
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-teal-600" /> Free Student Account
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-teal-600" /> Real Server Scoring
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-teal-600" /> Instant Skill Radar
              </span>
            </div>
          </div>

          {/* Interactive Dashboard Preview */}
          <div className="mt-8 max-w-5xl mx-auto rounded-2xl bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono font-medium text-slate-400">
                  PrepPilot AI Dashboard • Live Preview (Illustrative Student Data)
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-semibold">
                Target: Software Developer
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Radar Widget */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Multi-Category Skill Radar
                </h3>
                <SkillRadar
                  aptitude={78}
                  logical={82}
                  coding={70}
                  technical={65}
                  communication={80}
                  size={220}
                />
              </div>

              {/* Progress & Recommendations */}
              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Readiness Score</p>
                    <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">75%</p>
                    <span className="text-[11px] font-semibold text-teal-600">Placement Benchmark</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Roadmap Progress</p>
                    <p className="text-2xl font-extrabold text-teal-700 dark:text-teal-400 mt-1">12 / 30d</p>
                    <span className="text-[11px] font-semibold text-teal-600">40% Completed</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Active Streak</p>
                    <p className="text-2xl font-extrabold text-amber-600 mt-1">4 Days</p>
                    <span className="text-[11px] font-semibold text-amber-600">Daily Study Goal Met</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      AI Diagnostic Insights & Immediate Next Steps
                    </h4>
                    <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">Why this recommendation?</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5"></span>
                      <span>
                        <strong className="text-slate-800 dark:text-white">Priority 1: Dynamic Programming</strong> — You scored 40% on recursive memoization problems. Complete Day 13 drills to bridge this gap.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></span>
                      <span>
                        <strong className="text-slate-800 dark:text-white">Priority 2: Operating Systems Deadlocks</strong> — Review Coffman conditions and preemption principles.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5"></span>
                      <span>
                        <strong className="text-slate-800 dark:text-white">Strength: Aptitude & Reasoning</strong> — Top 15th percentile in Speed, Distance, and Syllogisms.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section: 5-step journey */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              The Proven 5-Step Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172554] dark:text-white mt-2">
              Assess → Analyze → Learn → Practice → Improve
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              A systematic student journey engineered to transform placement anxiety into measurable confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {steps.map((st, i) => (
              <div
                key={st.number}
                className="relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <span className="text-3xl font-black text-indigo-600/30 dark:text-indigo-400/30 font-mono block mb-2">
                    {st.number}
                  </span>
                  <h3 className="text-lg font-bold text-[#172554] dark:text-white mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>Step {i + 1}</span>
                  {i < steps.length - 1 && <ArrowRight size={14} className="hidden md:block" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F8FAFC] dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Complete Preparation Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172554] dark:text-white mt-2">
              Everything Needed to Clear Campus Drives
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              No generic questionnaires. Real engineering depth, verifiable scoring algorithms, and role-tailored roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#172554] dark:text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <button
                    onClick={handleStart}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 group-hover:translate-x-1 transition-transform"
                  >
                    Launch Feature <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-[#172554] dark:text-white mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-[#0F172A] dark:text-white hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-teal-800 text-white text-center shadow-xl">
            <h3 className="text-2xl font-bold">Ready to Benchmark Your Placement Readiness?</h3>
            <p className="mt-2 text-indigo-100 text-sm max-w-xl mx-auto">
              Start your free diagnostic assessment now and receive your comprehensive skill radar in under 10 minutes.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleStart}
                className="px-6 py-3 rounded-xl bg-white text-indigo-800 font-bold hover:bg-indigo-50 shadow-md text-sm transition-all"
              >
                Take Diagnostic Assessment
              </button>
              <button
                onClick={handleDemo}
                className="px-6 py-3 rounded-xl bg-indigo-900/60 text-white border border-indigo-400/40 hover:bg-indigo-900 font-semibold text-sm transition-all"
              >
                Explore Demo Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
