import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/useApp';
import { useToast } from '../../context/ToastContext';
import { Loader2 } from 'lucide-react';
import { Modal } from '../UI/Modal';
import { Input } from '../UI/Input';
import { Select, type SelectOption } from '../UI/Select';
import type { TodoItem } from '../../interfaces/TodoItem';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTodo?: TodoItem | null;
}

interface FormData {
  title: string;
  description: string;
  categoryId: string | number;
  priorityId: string | number;
}

interface FormErrors {
  title?: string;
  categoryId?: string;
  priorityId?: string;
}

export const TodoModal: React.FC<TodoModalProps> = ({ isOpen, onClose, editTodo }) => {
  const { categories, priorities, addTodo, updateTodo, loadCategories, loadPriorities } = useApp();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({ title: '', description: '', categoryId: '', priorityId: '' });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    loadCategories();
    loadPriorities();
  }, []);

  useEffect(() => {
    if (editTodo) {
      setForm({
        title: editTodo.title,
        description: editTodo.description || '',
        categoryId: editTodo.categoryId,
        priorityId: editTodo.priorityId,
      });
    } else {
      setForm({ title: '', description: '', categoryId: '', priorityId: '' });
    }
    setErrors({});
  }, [editTodo, isOpen]);

  // Dropdown options mapping
  const categoryOptions = useMemo<SelectOption[]>(() => {
    return categories.map(c => ({ value: c.id, label: c.name }));
  }, [categories]);

  const priorityOptions = useMemo<SelectOption[]>(() => {
    return priorities.map(p => {
      const dotColors: Record<string, string> = { high: '#dc2626', medium: '#d97706', low: '#16a34a' };
      return {
        value: p.id,
        label: p.name,
        color: dotColors[p.name.toLowerCase()] ?? '#6366f1'
      };
    });
  }, [priorities]);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.categoryId) e.categoryId = 'Please select a category';
    if (!form.priorityId) e.priorityId = 'Please select a priority';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        categoryId: Number(form.categoryId),
        priorityId: Number(form.priorityId),
        ...(editTodo ? { isCompleted: editTodo.isCompleted } : {}),
      };
      if (editTodo) {
        await updateTodo(editTodo.id, payload);
        showToast('Todo updated successfully', 'success');
      } else {
        await addTodo(payload);
        showToast('Todo created successfully', 'success');
      }
      onClose();
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTodo ? 'Edit Todo' : 'New Todo'}
      description={editTodo ? 'Update your task details' : 'Add a new task to your list'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <Input
            id="todo-title"
            label="Title *"
            value={form.title}
            onChange={e => {
              setForm(f => ({ ...f, title: e.target.value }));
              setErrors(er => ({ ...er, title: undefined }));
            }}
            placeholder="What needs to be done?"
            error={errors.title}
            autoFocus
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Description <span className="text-gray-450 font-normal">(optional)</span>
          </label>
          <textarea
            id="todo-description"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Add more details about this task..."
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 resize-y min-h-[80px]"
          />
        </div>

        {/* Category + Priority Dropdown Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Select
              id="todo-category"
              label="Category *"
              value={form.categoryId}
              onChange={val => {
                setForm(f => ({ ...f, categoryId: val }));
                setErrors(er => ({ ...er, categoryId: undefined }));
              }}
              options={categoryOptions}
              placeholder="Select..."
              error={errors.categoryId}
            />
          </div>

          <div>
            <Select
              id="todo-priority"
              label="Priority *"
              value={form.priorityId}
              onChange={val => {
                setForm(f => ({ ...f, priorityId: val }));
                setErrors(er => ({ ...er, priorityId: undefined }));
              }}
              options={priorityOptions}
              placeholder="Select..."
              error={errors.priorityId}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 justify-end pt-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="todo-save"
            type="submit"
            disabled={saving}
            className={`py-2 px-5 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5 transition-colors ${
              saving ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving...' : editTodo ? 'Update Todo' : 'Create Todo'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
