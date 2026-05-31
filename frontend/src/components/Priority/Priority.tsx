import React, { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/useApp';
import { useToast } from '../../context/ToastContext';
import { DeleteConfirm } from '../UI/DeleteConfirm';
import { PriorityModal } from './PriorityModal';
import { Input } from '../UI/Input';
import type { Priority as PriorityType } from '../../interfaces/Priority';
import { getPriorityTailwind } from './PriorityColorConfig';

export const Priority: React.FC = () => {
  const { priorities, loadPriorities, deletePriority } = useApp();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PriorityType | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPriority, setEditPriority] = useState<PriorityType | null>(null);

  useEffect(() => {
    loadPriorities();
  }, []);

  const filtered = priorities.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClick = () => {
    setEditPriority(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (priority: PriorityType) => {
    setEditPriority(priority);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePriority(deleteTarget.id);
      showToast(`Priority "${deleteTarget.name}" deleted`, 'success');
      setDeleteTarget(null);
    } catch {
      showToast('Failed to delete priority', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-[760px] mx-auto py-8 px-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Priorities</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage todo priority levels
          </p>
        </div>
        <button
          id="add-priority-btn"
          onClick={handleAddClick}
          className="flex items-center gap-2 py-2.5 px-5 rounded-full border-none bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold cursor-pointer shadow-[0_2px_8px_rgba(99,102,241,0.3)] transition-all"
        >
          <Plus size={16} />
          Add Priority
        </button>
      </div>

      {/* Search + list */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
        {/* Search bar using Custom Input */}
        <div className="p-3.5 px-4 border-b border-gray-100 relative">
          <Input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search priorities..."
            icon={<Search size={15} />}
          />
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="py-10 px-6 text-center">
            <AlertCircle size={32} className="mx-auto mb-3 text-gray-300" strokeWidth={1.5} />
            <p className="text-sm text-gray-400">
              {search ? 'No matching priorities' : 'No priorities yet. Click "Add Priority" to create one.'}
            </p>
          </div>
        ) : (
          filtered.map((priority, i) => {
            const colors = getPriorityTailwind(priority.name);
            return (
              <div
                key={priority.id}
                className={`p-3.5 px-4.5 flex items-center gap-3 transition-colors ${
                  i < filtered.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                </div>

                <span className="flex-1 text-sm font-medium text-gray-900">
                  {priority.name}
                </span>

                <button
                  onClick={() => handleEditClick(priority)}
                  title="Edit"
                  className="bg-transparent border border-gray-200 hover:border-gray-300 rounded-md cursor-pointer text-gray-400 hover:text-gray-600 flex p-1.5 items-center transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => setDeleteTarget(priority)}
                  title="Delete"
                  className="bg-transparent border-none rounded-md cursor-pointer text-red-400 hover:text-red-600 flex p-1.5 items-center transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
      </div>

      <PriorityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editPriority={editPriority}
      />

      <DeleteConfirm
        isOpen={!!deleteTarget}
        title={deleteTarget?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        deleting={deleting}
      />
    </div>
  );
};