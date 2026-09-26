import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CAREER_PROFILES } from '../server/curatedData';
import { CareerRole } from '../types';
import { Compass, CheckCircle2, ArrowRight, BookOpen, Layers, Award } from 'lucide-react';

interface CareerExplorerPageProps {
  onNavigate: (view: string) => void;
}

export const CareerExplorerPage: React.FC<CareerExplorerPageProps> = ({ onNavigate }) => {
  const { profile, updateStudentProfile } = useAuth();

  const handleSelectCareer = async (roleName: string) => {
    await updateStudentProfile({ targetCareer: roleName as CareerRole });
    onNavigate('roadmap');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Compass size={24} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
            AI Placement Career Explorer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare engineering placement domains, required competencies, compensation bands, and recommended portfolio projects.
          </p>
        </div>
      </div>

      {/* Career Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CAREER_PROFILES.map((prof) => {
          const isCurrentTarget = profile?.targetCareer === prof.role;
          return (
            <div
              key={prof.id}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between ${
                isCurrentTarget
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#172554] dark:text-white">
                    {prof.role}
                  </h3>
                  {isCurrentTarget ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold">
                      Current Target
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Typical: {prof.averagePackage}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {prof.description}
                </p>

                {/* Skills */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Core Technical Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {prof.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Capstone Projects */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    High-Yield Portfolio Projects
                  </span>
                  <div className="space-y-1.5">
                    {prof.suggestedProjects.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-white block">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Tech: {p.tech.join(', ')}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          {p.difficulty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {prof.prerequisites.slice(0, 45)}...
                </span>

                <button
                  type="button"
                  onClick={() => handleSelectCareer(prof.role)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isCurrentTarget
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50'
                  }`}
                >
                  {isCurrentTarget ? 'Regenerate Roadmap' : 'Set as Goal'} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
