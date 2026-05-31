import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import { useToast } from '../../context/ToastContext';
import { Loader2 } from 'lucide-react';
import { Modal } from '../UI/Modal';
import type { Priority } from '../../interfaces/Priority';

interface PriorityModalProps {
  isOpen: boolean;
  onClose: () => void;
  editPriority?: Priority | null;
}

export const PriorityModal: React.FC<PriorityModalProps> = ({ isOpen, onClose, editPriority }) => {
  const { addPriority, updatePriority } = useApp();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (editPriority) {
      setName(editPriority.name);
    } else {
      setName('');
    }
    setError(undefined);
  }, [editPriority, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Priority name is required');
      return;
    }
    setSaving(true);
    try {
      if (editPriority) {
        await updatePriority(editPriority.id, name.trim());
        showToast('Priority updated successfully', 'success');
      } else {
        await addPriority(name.trim());
        showToast('Priority created successfully', 'success');
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
      title={editPriority ? 'Edit Priority' : 'New Priority'}
      description={editPriority ? 'Update your priority details' : 'Add a new priority level'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Priority Name <span className="text-red-500">*</span>
          </label>
          <input
            id="priority-name-modal-input"
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(undefined); }}
            placeholder="e.g. High, Medium, Low..."
            className={`w-full px-3.5 py-2 rounded-lg border text-sm outline-none transition-colors ${
              error
                ? 'border-red-300 bg-red-50/50 text-red-950 placeholder-red-300 focus:border-red-400'
                : 'border-gray-200 bg-gray-50/50 focus:border-indigo-500'
            }`}
            autoFocus
          />
          {error && (
            <p className="text-xs text-red-600 mt-1.5">{error}</p>
          )}
        </div>
        <p className="text-xs text-gray-400">
          Tip: Use names like "High", "Medium", "Low" for automatic color coding.
        </p>

        {/* Actions */}
        <div className="flex gap-2.5 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="priority-save-modal-btn"
            type="submit"
            disabled={saving}
            className={`py-2 px-5 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5 transition-colors ${
              saving ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
            }`}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Saving...' : editPriority ? 'Update Priority' : 'Create Priority'}
          </button>
        </div>
      </form>
    </Modal>
  );
};