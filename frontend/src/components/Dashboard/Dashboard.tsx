import React, { useEffect, useMemo } from 'react';
import { useApp } from '../../context/useApp';
import {
  CheckSquare, CheckCircle2, Tag, AlertCircle, Sparkles,
} from 'lucide-react';
import { DashboardStatCard } from './DashboardStatCard';
import { CompletionRing } from './CompletionRing';
import { RecentTodos } from './RecentTodos';
import { PriorityBreakdown } from './PriorityBreakdown';
import { CategoryBreakdown } from './CategoryBreakdown';

export const Dashboard: React.FC = () => {
  const { categories, priorities, todos, loadCategories, loadPriorities, loadTodos } = useApp();

  useEffect(() => {
    loadCategories();
    loadPriorities();
    loadTodos();
  }, []);

  // Completion metrics
  const completed = todos.filter((t) => t.isCompleted).length;
  const pending = todos.length - completed;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const greetingEmoji = hour < 12 ? '🌤️' : hour < 17 ? '☀️' : '🌙';
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Rotating daily tip
  const tips = [
    'Focus on one primary task today for deep, quality work.',
    'Break big goals into small, actionable steps.',
    'A clean workspace encourages a clear, creative mind.',
    'Schedule focused time blocks — then take real breaks.',
    'Celebrate small wins — every completed task counts!',
  ];
  const currentTip = useMemo(() => tips[new Date().getDate() % tips.length], []);

  return (
    <div className="max-w-[1100px] mx-auto py-8 px-7">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/10 to-purple-50/20 border border-gray-150 rounded-3xl p-7 text-slate-800 shadow-[0_10px_30px_rgba(99,102,241,0.03)] mb-8">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-indigo-200/20 blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-36 h-36 rounded-full bg-purple-200/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-[200px]">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100/70 text-indigo-600 px-3 py-1 rounded-full text-[10.5px] font-bold tracking-wider uppercase mb-4">
              <Sparkles size={10} className="text-amber-500 animate-pulse" />
              Focus Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-800 leading-tight mb-1">
              {greeting}! {greetingEmoji}
            </h1>
            <p className="text-slate-400 text-sm mb-4 font-medium">{dateStr}</p>
            <div className="text-xs text-slate-600 bg-white/70 backdrop-blur-sm border border-slate-100 rounded-xl p-3.5 max-w-md leading-relaxed shadow-sm">
              <span className="font-bold text-indigo-500">Daily Tip: </span>
              {currentTip}
            </div>
          </div>

          <CompletionRing completed={completed} total={todos.length} pending={pending} />
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-4 mb-8">
        <DashboardStatCard
          icon={<CheckSquare size={20} />}
          label="Total Todos"
          value={todos.length}
          to="/todo"
          colorClass="text-indigo-600"
          bgClass="bg-indigo-50"
        />
        <DashboardStatCard
          icon={<AlertCircle size={20} />}
          label="Pending"
          value={pending}
          to="/todo"
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
        />
        <DashboardStatCard
          icon={<CheckCircle2 size={20} />}
          label="Completed"
          value={completed}
          to="/todo"
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
        <DashboardStatCard
          icon={<Tag size={20} />}
          label="Categories"
          value={categories.length}
          to="/category"
          colorClass="text-purple-600"
          bgClass="bg-purple-50"
        />
        <DashboardStatCard
          icon={<AlertCircle size={20} />}
          label="Priorities"
          value={priorities.length}
          to="/priority"
          colorClass="text-cyan-600"
          bgClass="bg-cyan-50"
        />
      </div>

      {/* ── Main Grid ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <RecentTodos todos={todos} />
        <div className="lg:col-span-5 flex flex-col gap-5">
          <PriorityBreakdown todos={todos} />
          <CategoryBreakdown categories={categories} todos={todos} />
        </div>
      </div>
    </div>
  );
};
