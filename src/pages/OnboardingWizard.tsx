import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CareerRole } from '../types';
import { ArrowRight, ArrowLeft, Check, Sparkles, BookOpen, Clock, Target, Code } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { profile, updateStudentProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile?.displayName || '');
  const [college, setCollege] = useState(profile?.college || '');
  const [degree, setDegree] = useState(profile?.degree || 'B.Tech');
  const [branch, setBranch] = useState(profile?.branch || 'Computer Science and Engineering');
  const [yearOfStudy, setYearOfStudy] = useState(profile?.yearOfStudy || 'Final Year (4th)');
  const [targetCareer, setTargetCareer] = useState<CareerRole>(profile?.targetCareer || 'Software Developer');
  const [preferredLanguage, setPreferredLanguage] = useState<'Python' | 'Java' | 'C' | 'C++'>(profile?.preferredLanguage || 'Python');
  const [prepLevel, setPrepLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(profile?.prepLevel || 'Intermediate');
  const [weakSubjects, setWeakSubjects] = useState<string[]>(
    profile?.weakSubjects?.length ? profile.weakSubjects : ['Dynamic Programming', 'Graph Theory']
  );
  const [dailyStudyTimeMinutes, setDailyStudyTimeMinutes] = useState(profile?.dailyStudyTimeMinutes || 90);
  const [targetDurationDays, setTargetDurationDays] = useState(profile?.targetDurationDays || 30);
  const [saving, setSaving] = useState(false);

  const careerOptions: { role: CareerRole; description: string }[] = [
    { role: 'Software Developer', description: 'Web, Backend, System Architecture, Algorithms & Databases' },
    { role: 'VLSI Engineer', description: 'Verilog, FPGA, Static Timing Analysis & Microelectronics' },
    { role: 'Embedded Systems Engineer', description: 'Firmware, RTOS, Device Drivers & Microcontrollers' },
    { role: 'Electronics Engineer', description: 'Circuit Design, Signals, Analog/Digital Systems' },
    { role: 'Data Analyst', description: 'SQL, Python, Business Intelligence & Statistical Analysis' },
    { role: 'Data Scientist', description: 'Machine Learning, Deep Learning, Predictive Modeling' },
    { role: 'DevOps / Cloud Engineer', description: 'CI/CD, Cloud Architecture, Containers & Infrastructure' }
  ];

  const availableWeakTopics = [
    'Dynamic Programming',
    'Graph Theory & Trees',
    'Recursion & Backtracking',
    'Time and Work / Speed & Distance',
    'Pointers & Memory Allocation',
    'Object-Oriented Design',
    'Database Normalization & SQL',
    'Operating System Deadlocks',
    'Digital Logic & Flip-Flops',
    'Computer Networks / TCP 3-Way Handshake',
    'HR Behavioral (STAR Method)',
    'Permutations & Combinations'
  ];

  const toggleWeakTopic = (topic: string) => {
    if (weakSubjects.includes(topic)) {
      setWeakSubjects(weakSubjects.filter((t) => t !== topic));
    } else {
      setWeakSubjects([...weakSubjects, topic]);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateStudentProfile({
        displayName: name || profile?.displayName || 'PrepPilot Student',
        college,
        degree,
        branch,
        yearOfStudy,
        targetCareer,
        preferredLanguage,
        prepLevel,
        weakSubjects,
        dailyStudyTimeMinutes,
        targetDurationDays,
        isOnboarded: true
      });
      onComplete();
    } catch (e) {
      console.error('Failed to save profile:', e);
      onComplete();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            <span>Step {step} of 3</span>
            <span>
              {step === 1 && 'Academic Background'}
              {step === 2 && 'Target Role & Language'}
              {step === 3 && 'Weak Areas & Schedule'}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10">
          {/* STEP 1: Academic Background */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#172554] dark:text-white">
                  Welcome to PrepPilot AI
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Tell us about your university studies so we can tailor your placement syllabus.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Preferred Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  College / University (Optional)
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Chennai Institute of Technology / NIT"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Degree
                  </label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>B.Tech</option>
                    <option>B.E.</option>
                    <option>M.Tech</option>
                    <option>MCA</option>
                    <option>BCA</option>
                    <option>B.Sc Computer Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Year of Study
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>1st Year (Freshman)</option>
                    <option>2nd Year (Sophomore)</option>
                    <option>3rd Year (Pre-Final)</option>
                    <option>Final Year (4th)</option>
                    <option>Recent Graduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Academic Branch / Major
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option>Computer Science and Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics and Communication (ECE)</option>
                  <option>Electrical and Electronics (EEE)</option>
                  <option>Artificial Intelligence & Data Science</option>
                  <option>Mechanical / Mechatronics Engineering</option>
                  <option>Other Engineering Discipline</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Target Role & Language */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#172554] dark:text-white">
                  Target Career & Programming Preference
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select your primary career aspiration for campus placements.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Target Placement Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {careerOptions.map((c) => {
                    const isSelected = targetCareer === c.role;
                    return (
                      <div
                        key={c.role}
                        onClick={() => setTargetCareer(c.role)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{c.role}</span>
                          {isSelected && <Check size={16} className="text-indigo-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          {c.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Preferred Coding Language
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>Python</option>
                    <option>Java</option>
                    <option>C++</option>
                    <option>C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Current Preparation Level
                  </label>
                  <select
                    value={prepLevel}
                    onChange={(e) => setPrepLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option>Beginner (Starting fresh)</option>
                    <option>Intermediate (Know fundamentals)</option>
                    <option>Advanced (Practiced 100+ LeetCode problems)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Weak Areas & Study Schedule */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#172554] dark:text-white">
                  Skill Focus & Study Commitments
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select your perceived weak areas so your initial roadmap targets your highest-yield gaps.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Select Weak Subject Areas (Pick 2 or more)
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {availableWeakTopics.map((topic) => {
                    const isSelected = weakSubjects.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleWeakTopic(topic)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✕ ' : '+ '}
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Daily Available Study Time
                  </label>
                  <select
                    value={dailyStudyTimeMinutes}
                    onChange={(e) => setDailyStudyTimeMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value={45}>45 Minutes / day</option>
                    <option value={60}>1 Hour / day</option>
                    <option value={90}>1.5 Hours / day</option>
                    <option value={120}>2 Hours / day</option>
                    <option value={180}>3+ Hours / day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Roadmap Duration
                  </label>
                  <select
                    value={targetDurationDays}
                    onChange={(e) => setTargetDurationDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value={7}>7-Day Sprint Roadmap</option>
                    <option value={15}>15-Day Accelerated Roadmap</option>
                    <option value={30}>30-Day Comprehensive Roadmap</option>
                    <option value={60}>60-Day Deep Placement Roadmap</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={15} /> Previous
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
              >
                Next Step <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={handleFinish}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 shadow-md shadow-teal-600/25 transition-all"
              >
                <Sparkles size={15} />
                {saving ? 'Configuring Profile...' : 'Complete & Launch Dashboard'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
