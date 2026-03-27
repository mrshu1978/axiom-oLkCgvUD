import { List, Plus, Tag } from 'lucide-react';

export default function BottomNav({ currentView, onViewChange }) {
  const navItems = [
    { id: 'tasks', label: 'Task', icon: List },
    { id: 'add-task', label: 'Aggiungi', icon: Plus },
    { id: 'categories', label: 'Categorie', icon: Tag },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A2E] border-t border-[#7C3AED]/20 h-16 flex flex-row items-center justify-around pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        const isFab = item.id === 'add-task';

        if (isFab) {
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="bg-[#7C3AED] rounded-full w-14 h-14 -mt-6 shadow-lg flex items-center justify-center"
              aria-label={item.label}
            >
              <Icon className="w-6 h-6 text-white" />
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className="flex flex-col items-center justify-center flex-1"
            aria-label={item.label}
          >
            <Icon
              className={`w-6 h-6 ${isActive ? 'text-[#7C3AED]' : 'text-[#9CA3AF]'}`}
            />
            <span
              className={`text-xs mt-1 ${isActive ? 'text-[#7C3AED]' : 'text-[#9CA3AF]'}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}