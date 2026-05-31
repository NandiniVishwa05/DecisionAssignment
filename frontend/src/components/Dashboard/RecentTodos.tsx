import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckSquare, Calendar, ChevronRight } from 'lucide-react';
import type { TodoItem } from '../../interfaces/TodoItem';

const PRIORITY_CONFIG: Record<
  string,
  { borderL: string; bg: string; text: string; label: string }
> = {
  high: {
    label: 'High',
    bg: 'bg-red-50',
    text: 'text-red-600',
    borderL: 'border-l-red-400',
  },
  medium: {
    label: 'Medium',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    borderL: 'border-l-amber-400',
  },
  low: {
    label: 'Low',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    borderL: 'border-l-emerald-400',
  },
};

const defaultPConfig = {
  label: 'Unknown',
  bg: 'bg-gray-50',
  text: 'text-gray-500',
  borderL: 'border-l-gray-300',
};

interface RecentTodosProps {
  todos: TodoItem[];
}

export const RecentTodos: React.FC<RecentTodosProps> = ({ todos }) => {
  const recent = useMemo(
    () =>
      [...todos]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6),
    [todos],
  );

  return (
    <div className="lg:col-span-7 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Clock size={15} className="text-indigo-500" />
          Recent Tasks
        </h2>
        <Link
          to="/todo"
          className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5 no-underline transition-colors"
        >
          View all <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex-1 divide-y divide-gray-50">
        {recent.length === 0 ? (
          <div className="py-14 text-center">
            <CheckSquare size={32} className="mx-auto mb-3 text-gray-200" strokeWidth={1.5} />
            <p className="text-xs text-gray-400 max-w-[200px] mx-auto leading-relaxed">
              No tasks yet. Create your first todo!
            </p>
          </div>
        ) : (
          recent.map((todo) => {
            const pKey = todo.priority?.name?.toLowerCase() ?? 'unknown';
            const pConfig = PRIORITY_CONFIG[pKey] ?? defaultPConfig;
            return (
              <div
                key={todo.id}
                className={`flex items-center gap-3.5 px-0 py-3.5 border-l-[3px] pl-6 pr-6 ${pConfig.borderL} hover:bg-gray-50/60 transition-colors`}
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    todo.isCompleted ? 'bg-emerald-400' : 'bg-gray-300'
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      todo.isCompleted
                        ? 'line-through text-gray-400'
                        : 'text-gray-900'
                    }`}
                  >
                    {todo.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {todo.category?.name && (
                      <span className="text-[10.5px] text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                        {todo.category.name}
                      </span>
                    )}
                    {todo.priority?.name && (
                      <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${pConfig.bg} ${pConfig.text}`}>
                        {todo.priority.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  {todo.isCompleted ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Calendar size={9} />
                    {new Date(todo.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
