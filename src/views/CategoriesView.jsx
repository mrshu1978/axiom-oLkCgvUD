import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import CategoryFormModal from '../components/categories/CategoryFormModal';

export default function CategoriesView() {
  const { categories, tasks, deleteCategory } = useAppStore();
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getTaskCount = (categoryId) => {
    return tasks.filter(t => t.categoryId === categoryId).length;
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setDeletingId(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
    setShowCreateModal(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-white mb-6">Categorie</h1>

      {/* Lista categorie */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-white font-medium">{cat.name}</span>
                <span className="text-[#9CA3AF] text-sm">
                  {getTaskCount(cat.id)} task
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingCategory(cat)}
                  className="text-[#9CA3AF] hover:text-white transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => setDeletingId(cat.id)}
                  className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Conferma eliminazione */}
            {deletingId === cat.id && (
              <div className="mt-4 p-3 bg-[#0A0A12] rounded-xl">
                <p className="text-[#9CA3AF] text-sm mb-3">
                  Eliminare questa categoria? I task associati non avranno più una categoria.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 py-2 text-[#9CA3AF] hover:text-white transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="flex-1 py-2 text-[#EF4444] hover:text-[#EF4444]/80 transition-colors"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottone nuova categoria */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Nuova Categoria
      </button>

      {/* Modals */}
      {editingCategory && (
        <CategoryFormModal
          category={editingCategory}
          onClose={handleCloseModal}
        />
      )}
      {showCreateModal && (
        <CategoryFormModal onClose={handleCloseModal} />
      )}
    </div>
  );
}