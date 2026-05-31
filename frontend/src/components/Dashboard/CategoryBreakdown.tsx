import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ChevronRight } from 'lucide-react';
import type { Category } from '../../interfaces/Category';
import type { TodoItem } from '../../interfaces/TodoItem';

interface CategoryBreakdownProps {
  categories: Category[];
  todos: TodoItem[];
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ categories, todos }) => {
  const categoryBreakdown = useMemo(
    () =>
      categories
        .map((cat) => ({
          ...cat,
          count: todos.filter((t) => t.categoryId === cat.id).length,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    [categories, todos],
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Tag size={15} className="text-purple-500" />
          By Category
        </h2>
        <Link
          to="/category"
          className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 flex items-center gap-0.5 no-underline transition-colors"
        >
          Manage <ChevronRight size={12} />
        </Link>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {categoryBreakdown.length === 0 ? (
          <div className="py-4 text-center">
            <Tag size={24} className="mx-auto mb-2 text-gray-200" strokeWidth={1.5} />
            <p className="text-xs text-gray-400">No categories yet.</p>
          </div>
        ) : (
          categoryBreakdown.map((cat) => {
            const rate =
              todos.length > 0
                ? Math.round((cat.count / todos.length) * 100)
                : 0;
            return (
              <div key={cat.id}>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-800 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block flex-shrink-0" />
                    {cat.name}
                  </span>
                  <span className="text-gray-400 font-medium">
                    {cat.count} {cat.count === 1 ? 'task' : 'tasks'} · {rate}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${rate}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
