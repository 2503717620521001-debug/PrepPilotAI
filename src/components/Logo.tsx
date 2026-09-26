import React from 'react';
import { Compass, Sparkles, GraduationCap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 34 : 26;
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-teal-500 shadow-md shadow-indigo-500/20 text-white">
        <Compass size={iconSize} className="animate-spin-slow" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-300"></span>
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`font-extrabold tracking-tight text-[#172554] dark:text-white ${textSize}`}>
            Prep<span className="text-indigo-600 dark:text-indigo-400">Pilot</span>
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 uppercase">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">
            Assess • Learn • Practice • Improve
          </span>
        )}
      </div>
    </div>
  );
};
