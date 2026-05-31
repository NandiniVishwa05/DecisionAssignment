import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Flame, ChevronRight } from 'lucide-react';
import type { TodoItem } from '../../interfaces/TodoItem';

const PRIORITY_CONFIG: Record<
  string,
  { dot: string; bg: string; text: string; bar: string; label: string }
> = {
  high: {
    label: 'High',
    dot: 'bg-red-500',
    bg: 'bg-red-50',
    text: 'text-red-600',
    bar: 'bg-red-400',
  },
  medium: {
    label: 'Medium',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    bar: 'bg-amber-400',
  },
  low: {
    label: 'Low',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    bar: 'bg-emerald-400',
  },
};

const defaultPConfig = {
  label: 'Unknown',
  dot: 'bg-gray-400',
  bg: 'bg-gray-50',
  text: 'text-gray-500',
  bar: 'bg-gray-300',
};

interface PriorityBreakdownProps {
  todos: TodoItem[];
}

export const PriorityBreakdown: React.FC<PriorityBreakdownProps> = ({ todos }) => {
  const priorityBreakdown = useMemo(() => {
    const map: Record<string, { key: string; name: string; total: number; done: number }> = {};
    todos.forEach((todo) => {
      const key = todo.priority?.name?.toLowerCase() ?? 'unknown';
      const name = todo.priority?.name ?? 'Unknown';
      if (!map[key]) map[key] = { key, name, total: 0, done: 0 };
      map[key].total++;
      if (todo.isCompleted) map[key].done++;
    });
    const order = ['high', 'medium', 'low'];
    return Object.values(map).sort(
      (a, b) => order.indexOf(a.key) - order.indexOf(b.key),
    );
  }, [todos]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Flame size={15} className="text-red-400" />
          Priority Overview
        </h2>
        <Link
          to="/priority"
          className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5 no-underline transition-colors"
        >
          Manage <ChevronRight size={12} />
        </Link>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {priorityBreakdown.length === 0 ? (
          <div className="py-6 text-center">
            <AlertCircle size={28} className="mx-auto mb-2 text-gray-200" strokeWidth={1.5} />
            <p className="text-xs text-gray-400">No tasks yet.</p>
          </div>
        ) : (
          priorityBreakdown.map(({ key, name, total, done }) => {
            const pConfig = PRIORITY_CONFIG[key] ?? defaultPConfig;
            const rate = total > 0 ? Math.round((done / total) * 100) : 0;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <span className={`w-2.5 h-2.5 rounded-full ${pConfig.dot} flex-shrink-0`} />
                    {name}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {done} / {total} done
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pConfig.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${rate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={`text-[10.5px] font-semibold ${pConfig.text}`}>
                    {rate}% complete
                  </span>
                  <span className="text-[10.5px] text-gray-400">{total} total</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
