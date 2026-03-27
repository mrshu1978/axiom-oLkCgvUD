import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Trash2, Check, Calendar } from 'lucide-react';
import { format, isPast } from 'date-fns';
import useAppStore from '../../store/useAppStore';

export default function TaskCard({ task, onEdit }) {
  const { deleteTask, toggleComplete, categories } = useAppStore();
  const [deltaX, setDeltaX] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const category = categories.find(c => c.id === task.categoryId);
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setDeltaX(eventData.deltaX);
    },
    onSwipedLeft: (eventData) => {
      if (eventData.absX > 80) {
        handleDelete();
      } else {
        setDeltaX(0);
      }
    },
    onSwipedRight: (eventData) => {
      if (eventData.absX > 80) {
        handleComplete();
      } else {
        setDeltaX(0);
      }
    },
    onSwiped: () => {
      setTimeout(() => setDeltaX(0), 300);
    },
    trackMouse: true,
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      setIsDeleting(false);
      setDeltaX(0);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await toggleComplete(task.id);
    } catch (error) {
      console.error('Failed to toggle complete:', error);
      setIsCompleting(false);
      setDeltaX(0);
    }
  };

  const handleTap = () => {
    if (Math.abs(deltaX) < 10) {
      onEdit(task);
    }
  };

  return (
    <div className="relative overflow-hidden" {...handlers}>
      {/* Delete layer (left swipe) */}
      <div
        className="absolute inset-y-0 left-0 w-20 bg-[#EF4444]/80 flex items-center justify-end pr-4 z-10"
        style={{ transform: `translateX(${Math.min(deltaX, 0)}px)` }}
      >
        <Trash2 className="text-white" size={24} />
      </div>

      {/* Complete layer (right swipe) */}
      <div
        className="absolute inset-y-0 right-0 w-20 bg-[#10B981]/80 flex items-center justify-start pl-4 z-10"
        style={{ transform: `translateX(${Math.max(deltaX, 0)}px)` }}
      >
        <Check className="text-white" size={24} />
      </div>

      {/* Main card */}
      <div
        className={`card relative z-20 transition-transform duration-200 ${
          isDeleting || isCompleting ? 'scale-95 opacity-0' : ''
        } ${task.completed ? 'opacity-60' : ''}`}
        style={{ transform: `translateX(${deltaX}px)` }}
        onClick={handleTap}
      >
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
          <div className="flex items-center gap-1">
            <Calendar size={12} className={isOverdue ? 'text-[#EF4444]' : 'text-[#9CA3AF]'} />
            <span className={`text-xs ${isOverdue ? 'text-[#EF4444]' : 'text-[#9CA3AF]'}`}>
              {task.dueDate
                ? format(new Date(task.dueDate), 'dd/MM/yyyy')
                : 'Nessuna scadenza'}
            </span>
          </div>

          {category && (
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-[#9CA3AF] text-xs">
                {category.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}