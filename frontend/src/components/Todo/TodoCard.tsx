import React, { useState } from 'react';
import { Pencil, Trash2, Check, Calendar } from 'lucide-react';
import type { TodoItem } from '../../interfaces/TodoItem';

interface TodoCardProps {
  todo: TodoItem;
  onEdit: (todo: TodoItem) => void;
  onDelete: (todo: TodoItem) => void;
  onToggleComplete: (todo: TodoItem) => void;
}

const PRIORITY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  high:   { bg: 'bg-red-50 text-red-700', text: 'text-red-700', dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-50 text-amber-800', text: 'text-amber-800', dot: 'bg-amber-500' },
  low:    { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  work:     { bg: 'bg-indigo-50 text-indigo-700', text: 'text-indigo-700' },
  personal: { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-700' },
};

const getPriorityStyle = (name = '') => {
  const key = name.toLowerCase();
  return PRIORITY_STYLES[key] ?? { bg: 'bg-gray-50 text-gray-700', text: 'text-gray-700', dot: 'bg-gray-400' };
};

const getCategoryStyle = (name = '') => {
  const key = name.toLowerCase();
  return CATEGORY_STYLES[key] ?? { bg: 'bg-slate-50 text-slate-700', text: 'text-slate-700' };
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const TodoCard: React.FC<TodoCardProps> = ({ todo, onEdit, onDelete, onToggleComplete }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = (todo.description?.length ?? 0) > 100;
  const displayDesc = expanded || !isLong ? todo.description : todo.description?.slice(0, 100) + '...';

  const priorityStyle = getPriorityStyle(todo.priority?.name);
  const categoryStyle = getCategoryStyle(todo.category?.name);

  return (
    <div
      className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3.5 ${
        todo.isCompleted ? 'opacity-65' : ''
      }`}
    >
      {/* Top row: title + actions */}
      <div className="flex items-start gap-3">
        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-[15px] font-semibold text-gray-900 leading-snug break-words ${
            todo.isCompleted ? 'line-through text-gray-400' : ''
          }`}>
            {todo.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            id={`todo-edit-${todo.id}`}
            onClick={() => onEdit(todo)}
            title="Edit"
            className="w-7.5 h-7.5 rounded-lg border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            id={`todo-delete-${todo.id}`}
            onClick={() => onDelete(todo)}
            title="Delete"
            className="w-7.5 h-7.5 rounded-lg border border-transparent hover:bg-red-50 flex items-center justify-center text-red-400 hover:text-red-600 cursor-pointer transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Description */}
      {todo.description && (
        <p className="text-xs text-gray-500 leading-relaxed break-words">
          {displayDesc}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="bg-transparent border-none cursor-pointer text-indigo-600 text-xs font-semibold px-1.5 hover:text-indigo-700 transition-colors"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      )}

      {/* Footer: badges + date + complete button */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyle.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot} inline-block`} />
          {todo.priority?.name || 'Unknown'}
        </span>

        {/* Category badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle.bg}`}>
          {todo.category?.name || 'Unknown'}
        </span>

        {/* Spacer */}
        <span className="flex-1" />

        {/* Date */}
        <span className="flex items-center gap-1.2 text-xs text-gray-400 mr-2">
          <Calendar size={11} />
          {formatDate(todo.createdAt)}
        </span>

        {/* Complete button */}
        <button
          id={`todo-complete-${todo.id}`}
          onClick={() => onToggleComplete(todo)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
            todo.isCompleted
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
              : 'bg-indigo-50 text-indigo-700 border border-indigo-150 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-[0_1px_2px_rgba(99,102,241,0.05)]'
          }`}
          title={todo.isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          <Check size={12} className={todo.isCompleted ? 'stroke-[3.5]' : 'stroke-[2.5]'} />
          {todo.isCompleted ? 'Completed' : 'Mark as Complete'}
        </button>
      </div>
    </div>
  );
};
