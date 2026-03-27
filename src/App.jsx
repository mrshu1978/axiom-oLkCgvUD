import { useState, useEffect } from 'react';
import BottomNav from './components/layout/BottomNav';
import TaskListView from './views/TaskListView';
import CategoriesView from './views/CategoriesView';
import TaskFormModal from './components/tasks/TaskFormModal';
import useAppStore from './store/useAppStore';

export default function App() {
  const [currentView, setCurrentView] = useState('tasks');
  const [editingTask, setEditingTask] = useState(null);
  const { loadAll, isLoading } = useAppStore();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleCloseModal = () => {
    setEditingTask(null);
    setCurrentView('tasks');
  };

  const renderView = () => {
    switch (currentView) {
      case 'tasks':
        return <TaskListView onEditTask={setEditingTask} />;
      case 'categories':
        return <CategoriesView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto pb-16">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[#9CA3AF]">Caricamento...</div>
          </div>
        ) : (
          renderView()
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />

      {/* Modals */}
      {(currentView === 'add-task' || editingTask) && (
        <TaskFormModal
          task={editingTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}