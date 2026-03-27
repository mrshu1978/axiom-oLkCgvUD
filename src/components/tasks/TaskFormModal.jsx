import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function TaskFormModal({ task, onClose }) {
  const { createTask, updateTask, categories } = useAppStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [categoryId, setCategoryId] = useState('');
  const [titleError, setTitleError] = useState('');

  // Pre-fill form if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate || '');
      setPriority(task.priority);
      setCategoryId(task.categoryId || '');
    } else {
      // Reset for create mode
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setCategoryId('');
      setTitleError('');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('Il titolo è obbligatorio');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      priority,
      categoryId: categoryId || null,
    };

    try {
      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask(taskData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="bg-[#1A1A2E] rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto transform transition-transform duration-300 translate-y-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">
              {task ? 'Modifica Task' : 'Nuova Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-[#9CA3AF] hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titolo */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Titolo *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setTitleError('');
                }}
                placeholder="Titolo della task"
                maxLength={100}
                className="input-field"
                autoFocus
              />
              {titleError && (
                <p className="text-[#EF4444] text-sm mt-1">{titleError}</p>
              )}
            </div>

            {/* Descrizione */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Descrizione (opzionale)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrizione opzionale"
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {/* Scadenza */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Scadenza (opzionale)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Priorità */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Priorità
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'high', label: 'Alta', color: 'border-[#EF4444]' },
                  { value: 'medium', label: 'Media', color: 'border-[#F59E0B]' },
                  { value: 'low', label: 'Bassa', color: 'border-[#10B981]' },
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                      priority === p.value
                        ? `${p.color} bg-${p.color.split('-')[1]}/10 text-white`
                        : 'border-[#7C3AED]/30 text-[#9CA3AF] hover:border-[#7C3AED]/50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Categoria (opzionale)
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input-field"
              >
                <option value="">Nessuna categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <button type="submit" className="btn-primary w-full">
              Salva Task
            </button>
          </form>
        </div>
      </div>
    </>
  );
}