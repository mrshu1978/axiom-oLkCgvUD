export default function TaskFormModal({ task, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center z-50">
      <div className="bg-[#1A1A2E] rounded-t-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">
            {task ? 'Modifica Task' : 'Nuova Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-white"
          >
            ✕
          </button>
        </div>
        <p className="text-[#9CA3AF] text-sm">
          Funzionalità form sarà implementata in TASK-007
        </p>
        <button
          onClick={onClose}
          className="btn-primary w-full mt-6"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}