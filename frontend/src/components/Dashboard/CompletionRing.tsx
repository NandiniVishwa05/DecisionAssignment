import React, { useMemo } from 'react';

interface CompletionRingProps {
  completed: number;
  total: number;
  pending: number;
}

export const CompletionRing: React.FC<CompletionRingProps> = ({ completed, total, pending }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl px-6 py-5 shadow-sm flex items-center gap-6">
      <div className="relative w-[80px] h-[80px] flex items-center justify-center flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <defs>
            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle
            cx="40" cy="40" r={radius}
            className="stroke-slate-100 fill-none"
            strokeWidth="7.5"
          />
          <circle
            cx="40" cy="40" r={radius}
            className="fill-none transition-all duration-700 ease-out"
            stroke="url(#progressGrad)"
            strokeWidth="7.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-sm font-black text-slate-800">{completionRate}%</span>
      </div>
      <div>
        <div className="text-2xl font-black text-slate-800">
          {completed}
          <span className="text-slate-400 font-semibold text-base"> / {total}</span>
        </div>
        <div className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
          Tasks Done
        </div>
        <div className="mt-2.5 flex gap-2 text-[11px] font-medium">
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Pending: <strong className="font-bold">{pending}</strong>
          </span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Done: <strong className="font-bold">{completed}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
