import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { useToast } from '../../context/ToastContext';
import { TodoCard } from './TodoCard';
import { TodoModal } from './TodoModal';
import { DeleteConfirm } from '../UI/DeleteConfirm';
import { SkeletonGrid } from './TodoSkeleton';
import { Input } from '../UI/Input';
import { Select, type SelectOption } from '../UI/Select';
import type { TodoItem } from '../../interfaces/TodoItem';

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

// ─── Filter chip types ────────────────────────────────────────────────────────
type CompletionFilter = 'all' | 'pending' | 'completed';

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onClick, color }) => {
  const getFilterColorClasses = () => {
    if (!active) return 'border-gray-200 bg-white text-gray-500 hover:border-gray-300';
    if (!color) return 'border-indigo-600 bg-indigo-50 text-indigo-600 font-semibold';
    if (color === '#dc2626') return 'border-red-500 bg-red-50 text-red-700 font-semibold';
    if (color === '#d97706') return 'border-amber-500 bg-amber-50 text-amber-700 font-semibold';
    if (color === '#16a34a') return 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold';
    if (color === '#10b981') return 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold';
    if (color === '#f59e0b') return 'border-amber-500 bg-amber-50 text-amber-700 font-semibold';
    return 'border-indigo-600 bg-indigo-50 text-indigo-600 font-semibold';
  };

  return (
    <button
      onClick={onClick}
      className={`py-1.5 px-3.5 rounded-full border text-xs cursor-pointer whitespace-nowrap transition-all ${getFilterColorClasses()}`}
    >
      {label}
    </button>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState: React.FC<{ onAdd: () => void; isFiltered: boolean }> = ({ onAdd, isFiltered }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-1 text-indigo-600">
      <ClipboardList size={32} strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-bold text-gray-900">
      {isFiltered ? 'No matching todos' : 'No todos yet'}
    </h3>
    <p className="text-sm text-gray-400 max-w-[300px] leading-relaxed">
      {isFiltered
        ? "Try adjusting your filters or search query to find what you're looking for."
        : 'Start by creating your first todo. Stay organized and on top of your tasks.'}
    </p>
    {!isFiltered && (
      <button
        id="empty-add-todo"
        onClick={onAdd}
        className="mt-2 py-2.5 px-6 rounded-full border-none bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold cursor-pointer flex items-center gap-1.5 transition-colors shadow-[0_2px_8px_rgba(99,102,241,0.3)]"
      >
        <Plus size={16} />
        Create your first todo
      </button>
    )}
  </div>
);

// ─── Main Todo page ───────────────────────────────────────────────────────────
export const Todo: React.FC = () => {
  const {
    todos, categories, priorities,
    loadTodos, loadCategories, loadPriorities,
    deleteTodo, toggleTodoComplete, loading,
  } = useApp();
  const { showToast } = useToast();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editTodo, setEditTodo] = useState<TodoItem | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<TodoItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>('all');

  // Pagination
  const [page, setPage] = useState(1);

  // Initial load
  useEffect(() => {
    loadTodos();
    loadCategories();
    loadPriorities();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, priorityFilter, completionFilter]);

  // Dropdown options
  const categoryOptions = useMemo<SelectOption[]>(
    () => [
      { value: 'all', label: 'All Categories' },
      ...categories.map((c) => ({ value: String(c.id), label: c.name })),
    ],
    [categories],
  );

  const priorityOptions = useMemo<SelectOption[]>(
    () => [
      { value: 'all', label: 'All Priorities' },
      ...priorities.map((p) => {
        const dotColors: Record<string, string> = {
          high: '#dc2626',
          medium: '#d97706',
          low: '#16a34a',
        };
        return {
          value: String(p.id),
          label: p.name,
          color: dotColors[p.name.toLowerCase()] ?? '#6366f1',
        };
      }),
    ],
    [priorities],
  );

  // ── Filtered todos ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return todos.filter((todo) => {
      if (q && !todo.title.toLowerCase().includes(q) && !(todo.description ?? '').toLowerCase().includes(q))
        return false;
      if (categoryFilter !== 'all' && String(todo.categoryId) !== categoryFilter) return false;
      if (priorityFilter !== 'all' && String(todo.priorityId) !== priorityFilter) return false;
      if (completionFilter === 'completed' && !todo.isCompleted) return false;
      if (completionFilter === 'pending' && todo.isCompleted) return false;
      return true;
    });
  }, [todos, search, categoryFilter, priorityFilter, completionFilter]);

  const isFiltered = !!(
    search ||
    categoryFilter !== 'all' ||
    priorityFilter !== 'all' ||
    completionFilter !== 'all'
  );

  // ── Pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEdit = (todo: TodoItem) => {
    setEditTodo(todo);
    setShowModal(true);
  };
  const handleAdd = () => {
    setEditTodo(null);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditTodo(null);
  };
  const handleDeleteRequest = (todo: TodoItem) => setDeleteTarget(todo);
  const handleDeleteCancel = () => setDeleteTarget(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTodo(deleteTarget.id);
      showToast(`"${deleteTarget.title}" deleted`, 'success');
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete todo', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleComplete = async (todo: TodoItem) => {
    try {
      await toggleTodoComplete(todo);
      showToast(todo.isCompleted ? 'Marked as pending' : 'Marked as complete', 'success');
    } catch {
      showToast('Failed to update todo', 'error');
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const total = todos.length;
  const completed = todos.filter((t) => t.isCompleted).length;
  const pending = total - completed;

  return (
    <div className="max-w-[1100px] mx-auto py-8 px-7">

      {/* ── Page header ── */}
      <div className="mb-7">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Todo Manager
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Organize your tasks efficiently
            </p>
          </div>
          <button
            id="add-todo-btn"
            onClick={handleAdd}
            className="flex items-center gap-2 py-2.5 px-5 rounded-full border-none bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold cursor-pointer shadow-[0_2px_8px_rgba(99,102,241,0.3)] transition-all"
          >
            <Plus size={16} />
            Add Todo
          </button>
        </div>

        {/* Stats strip */}
        {total > 0 && (
          <div className="flex gap-4 mt-5 flex-wrap">
            {[
              { label: 'Total', value: total, color: 'bg-indigo-500' },
              { label: 'Pending', value: pending, color: 'bg-amber-500' },
              { label: 'Completed', value: completed, color: 'bg-emerald-500' },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 py-1.5 px-3.5 bg-white border border-gray-100 rounded-lg text-xs shadow-sm"
              >
                <span className={`w-2 h-2 rounded-full ${s.color} inline-block`} />
                <span className="text-gray-400">{s.label}</span>
                <span className="font-bold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Search + Dropdowns Row ── */}
      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <div className="flex-1 min-w-[260px]">
          <Input
            id="todo-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search todos by title or description..."
            icon={<Search size={16} />}
          />
        </div>

        <div className="min-w-[170px]">
          <Select
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(String(val))}
            options={categoryOptions}
            placeholder="All Categories"
          />
        </div>

        <div className="min-w-[165px]">
          <Select
            value={priorityFilter}
            onChange={(val) => setPriorityFilter(String(val))}
            options={priorityOptions}
            placeholder="All Priorities"
          />
        </div>
      </div>

      {/* ── Status Filter Chips & Mini Pagination Row ── */}
      <div className="flex items-center justify-between gap-4 pb-1 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {(['all', 'pending', 'completed'] as CompletionFilter[]).map((f) => (
            <FilterChip
              key={f}
              label={f.charAt(0).toUpperCase() + f.slice(1)}
              active={completionFilter === f}
              onClick={() => setCompletionFilter(f)}
              color={f === 'completed' ? '#10b981' : f === 'pending' ? '#f59e0b' : undefined}
            />
          ))}
        </div>

        {/* Mini pagination buttons on top-right of todo card section */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold select-none">
            Page {page} of {Math.max(1, totalPages)}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-650 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white"
              title="Previous page"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-650 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer bg-white"
              title="Next page"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading && todos.length === 0 ? (
        <SkeletonGrid count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState onAdd={handleAdd} isFiltered={isFiltered} />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-3.5 animate-fadeIn">
          {paginated.map((todo) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      <TodoModal
        isOpen={showModal}
        onClose={handleCloseModal}
        editTodo={editTodo}
      />
      <DeleteConfirm
        isOpen={!!deleteTarget}
        title={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        deleting={deleting}
      />
    </div>
  );
};
