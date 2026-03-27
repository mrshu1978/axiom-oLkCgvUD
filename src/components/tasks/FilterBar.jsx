import { CheckSquare } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function FilterBar() {
  const { categories, activeFilter, setFilter } = useAppStore();

  const priorityOptions = [
    { id: 'high', label: 'Alta' },
    { id: 'medium', label: 'Media' },
    { id: 'low', label: 'Bassa' },
  ];

  const handlePriorityClick = (priority) => {
    if (activeFilter.priority === priority) {
      setFilter({ priority: null });
    } else {
      setFilter({ priority });
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (activeFilter.categoryId === categoryId) {
      setFilter({ categoryId: null });
    } else {
      setFilter({ categoryId });
    }
  };

  const handleShowCompletedToggle = () => {
    setFilter({ showCompleted: !activeFilter.showCompleted });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {/* Tutti pill */}
      <button
        onClick={() => setFilter({ categoryId: null, priority: null })}
        className={`rounded-full px-3 py-1 text-sm whitespace-nowrap ${
          !activeFilter.categoryId && !activeFilter.priority
            ? 'bg-[#7C3AED] text-white'
            : 'bg-[#1A1A2E] text-[#9CA3AF]'
        }`}
      >
        Tutti
      </button>

      {/* Priority pills */}
      {priorityOptions.map((priority) => (
        <button
          key={priority.id}
          onClick={() => handlePriorityClick(priority.id)}
          className={`rounded-full px-3 py-1 text-sm whitespace-nowrap ${
            activeFilter.priority === priority.id
              ? 'bg-[#7C3AED] text-white'
              : 'bg-[#1A1A2E] text-[#9CA3AF]'
          }`}
        >
          {priority.label}
        </button>
      ))}

      {/* Category pills */}
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className="flex items-center gap-1 rounded-full px-3 py-1 text-sm whitespace-nowrap bg-[#1A1A2E] text-[#9CA3AF]"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          <span
            className={
              activeFilter.categoryId === category.id ? 'text-white' : ''
            }
          >
            {category.name}
          </span>
        </button>
      ))}

      {/* Show completed toggle */}
      <button
        onClick={handleShowCompletedToggle}
        className={`ml-auto flex items-center gap-1 rounded-full px-3 py-1 text-sm whitespace-nowrap ${
          activeFilter.showCompleted
            ? 'bg-[#7C3AED] text-white'
            : 'bg-[#1A1A2E] text-[#9CA3AF]'
        }`}
      >
        <CheckSquare className="w-4 h-4" />
        Completati
      </button>
    </div>
  );
}