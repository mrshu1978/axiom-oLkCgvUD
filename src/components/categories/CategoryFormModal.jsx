import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const COLOR_PRESETS = [
  '#7C3AED', // purple
  '#EF4444', // red
  '#10B981', // green
  '#F59E0B', // yellow
  '#3B82F6', // blue
  '#EC4899', // pink
  '#8B5CF6', // violet
  '#06B6D4', // cyan
];

export default function CategoryFormModal({ category, onClose }) {
  const { createCategory, updateCategory } = useAppStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [nameError, setNameError] = useState('');

  // Pre-fill form if editing
  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
    } else {
      setName('');
      setColor(COLOR_PRESETS[0]);
      setNameError('');
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Il nome è obbligatorio');
      return;
    }

    const categoryData = {
      name: name.trim(),
      color,
    };

    try {
      if (category) {
        await updateCategory(category.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save category:', error);
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
              {category ? 'Modifica Categoria' : 'Nuova Categoria'}
            </h2>
            <button
              onClick={onClose}
              className="text-[#9CA3AF] hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                placeholder="Nome categoria"
                maxLength={30}
                className="input-field"
                autoFocus
              />
              {nameError && (
                <p className="text-[#EF4444] text-sm mt-1">{nameError}</p>
              )}
            </div>

            {/* Colore */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Colore
              </label>
              <div className="grid grid-cols-4 gap-3">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="aspect-square rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && (
                      <div className="w-6 h-6 rounded-full border-2 border-white" />
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[#9CA3AF] text-sm">
                Selezionato: <span style={{ color }}>{color}</span>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" className="btn-primary w-full">
              Salva Categoria
            </button>
          </form>
        </div>
      </div>
    </>
  );
}