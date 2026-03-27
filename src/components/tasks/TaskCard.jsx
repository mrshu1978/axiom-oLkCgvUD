// Placeholder per TASK-008
export default function TaskCard({ task, onEdit }) {
  return (
    <div className="card" onClick={() => onEdit(task)}>
      <div className="flex justify-between items-start">
        <h3 className={`text-white font-semibold text-base ${task.completed ? 'line-through' : ''}`}>
          {task.title}
        </h3>
        <span className={`badge-${task.priority}`}>
          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Bassa'}
        </span>
      </div>
      {task.description && (
        <p className="text-[#9CA3AF] text-sm mt-2 truncate">
          {task.description}
        </p>
      )}
      <div className="flex justify-between items-center mt-3">
        <div className="text-[#9CA3AF] text-xs">
          {task.dueDate ? `Scadenza: ${task.dueDate}` : 'Nessuna scadenza'}
        </div>
        {task.categoryId && (
          <div className="text-[#9CA3AF] text-xs">
            Categoria: {task.categoryId}
          </div>
        )}
      </div>
    </div>
  );
}