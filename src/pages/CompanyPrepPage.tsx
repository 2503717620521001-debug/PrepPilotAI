import React, { useState } from 'react';
import { COMPANY_TRACKS } from '../server/curatedData';
import { CompanyTrack } from '../types';
import { Building2, ShieldCheck, ChevronRight, Layers, Target, CheckCircle2, BookOpen } from 'lucide-react';

export const CompanyPrepPage: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyTrack>(COMPANY_TRACKS[0]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#172554] dark:text-white">
              Company-Specific Placement Tracks
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified campus hiring processes, cutoff benchmarks, frequently asked DSA, and round-by-round tips.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-teal-600 font-semibold">
          <ShieldCheck size={16} /> Verified Public Information
        </div>
      </div>

      {/* Company Selector Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {COMPANY_TRACKS.map((c) => {
          const isSelected = c.id === selectedCompany.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCompany(c)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold block">{c.companyName}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {c.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Company Detailed Breakdown */}
      <div className="space-y-6">
        {/* Overview Bar */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {selectedCompany.category}
            </span>
            <h2 className="text-2xl font-extrabold text-[#172554] dark:text-white mt-1">
              {selectedCompany.companyName} Campus Preparation Track
            </h2>
          </div>

          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-right">
            <span className="text-[11px] text-teal-800 dark:text-teal-300 font-bold block">
              Estimated OA Cutoff Score
            </span>
            <span className="text-2xl font-black text-teal-700 dark:text-teal-400">
              {selectedCompany.cutoffAptitudeScore}%
            </span>
          </div>
        </div>

        {/* Hiring Rounds Timeline */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#172554] dark:text-white uppercase tracking-wider">
            Campus Hiring Rounds & Structure
          </h3>

          <div className="space-y-4">
            {selectedCompany.hiringRounds.map((round) => (
              <div
                key={round.roundNumber}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 dark:text-white">
                    Round {round.roundNumber}: {round.roundName}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {round.description}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 mt-0.5">
                    Key Topics:
                  </span>
                  {round.commonTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked DSA & Prep Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Frequently Asked DSA Topics & Problems
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {selectedCompany.frequentlyAskedDSA.map((prob, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
                  <span className="font-semibold text-slate-800 dark:text-white">{prob}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white">
              Insider Placement Strategy Tips
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {selectedCompany.prepTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
