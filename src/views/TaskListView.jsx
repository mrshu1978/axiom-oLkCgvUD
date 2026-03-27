import { CheckCircle } from 'lucide-react';
import FilterBar from '../components/tasks/FilterBar';
import TaskCard from '../components/tasks/TaskCard';
import useAppStore from '../store/useAppStore';

export default function TaskListView({ onEditTask }) {
  const { useFilteredTasks, tasks } = useAppStore();
  const filteredTasks = useFilteredTasks();
  const incompleteCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="flex flex-col h-full p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">I Miei Task</h1>
        <p className="text-[#9CA3AF] text-sm">
          {incompleteCount} task da completare
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto mt-4">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <CheckCircle className="w-16 h-16 text-[#7C3AED]/40 mb-4" />
            <p className="text-[#9CA3AF]">Nessun task</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}