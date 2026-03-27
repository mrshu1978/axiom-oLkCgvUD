import { create } from 'zustand';
import { nanoid } from 'nanoid';
import {
  getTasks,
  getTaskById,
  addTask as dbAddTask,
  updateTask as dbUpdateTask,
  deleteTask as dbDeleteTask,
  getCategories,
  addCategory as dbAddCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
} from '../db/database.js';

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string|null} description
 * @property {string|null} dueDate
 * @property {'high'|'medium'|'low'} priority
 * @property {string|null} categoryId
 * @property {boolean} completed
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} color
 * @property {string} createdAt
 */

/**
 * @typedef {Object} FilterState
 * @property {string|null} categoryId
 * @property {'high'|'medium'|'low'|null} priority
 * @property {boolean} showCompleted
 */

/**
 * @typedef {Object} AppStore
 * @property {Task[]} tasks
 * @property {Category[]} categories
 * @property {FilterState} activeFilter
 * @property {boolean} isLoading
 * @property {Function} loadAll
 * @property {Function} createTask
 * @property {Function} updateTask
 * @property {Function} deleteTask
 * @property {Function} toggleComplete
 * @property {Function} createCategory
 * @property {Function} updateCategory
 * @property {Function} deleteCategory
 * @property {Function} setFilter
 * @property {Function} useFilteredTasks
 */

const useAppStore = create((set, get) => ({
  tasks: [],
  categories: [],
  activeFilter: {
    categoryId: null,
    priority: null,
    showCompleted: false,
  },
  isLoading: false,

  // Load all data from IndexedDB
  loadAll: async () => {
    set({ isLoading: true });
    try {
      const [tasks, categories] = await Promise.all([
        getTasks(),
        getCategories(),
      ]);
      set({ tasks, categories, isLoading: false });
    } catch (error) {
      console.error('Failed to load data:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Create a new task
  createTask: async (data) => {
    const taskData = {
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
      priority: data.priority || 'medium',
      categoryId: data.categoryId || null,
      completed: false,
    };
    const task = await dbAddTask(taskData);
    set((state) => ({
      tasks: [...state.tasks, task],
    }));
    return task;
  },

  // Update an existing task
  updateTask: async (id, patch) => {
    const existingTask = get().tasks.find((t) => t.id === id);
    if (!existingTask) {
      throw new Error(`Task ${id} not found`);
    }
    const updatedTask = { ...existingTask, ...patch };
    await dbUpdateTask(updatedTask);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
    }));
    return updatedTask;
  },

  // Delete a task
  deleteTask: async (id) => {
    await dbDeleteTask(id);
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  // Toggle task completion
  toggleComplete: async (id) => {
    const existingTask = get().tasks.find((t) => t.id === id);
    if (!existingTask) {
      throw new Error(`Task ${id} not found`);
    }
    const updatedTask = { ...existingTask, completed: !existingTask.completed };
    await dbUpdateTask(updatedTask);
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
    }));
    return updatedTask;
  },

  // Create a new category
  createCategory: async (data) => {
    const categoryData = {
      name: data.name,
      color: data.color,
    };
    const category = await dbAddCategory(categoryData);
    set((state) => ({
      categories: [...state.categories, category],
    }));
    return category;
  },

  // Update an existing category
  updateCategory: async (id, patch) => {
    const existingCategory = get().categories.find((c) => c.id === id);
    if (!existingCategory) {
      throw new Error(`Category ${id} not found`);
    }
    const updatedCategory = { ...existingCategory, ...patch };
    await dbUpdateCategory(updatedCategory);
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? updatedCategory : c)),
    }));
    return updatedCategory;
  },

  // Delete a category and nullify categoryId on affected tasks
  deleteCategory: async (id) => {
    // First, update tasks that have this categoryId
    const tasksToUpdate = get().tasks.filter((t) => t.categoryId === id);
    for (const task of tasksToUpdate) {
      const updatedTask = { ...task, categoryId: null };
      await dbUpdateTask(updatedTask);
    }

    // Delete the category
    await dbDeleteCategory(id);

    // Update store state
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      tasks: state.tasks.map((t) =>
        t.categoryId === id ? { ...t, categoryId: null } : t
      ),
    }));
  },

  // Update filter
  setFilter: (patch) => {
    set((state) => ({
      activeFilter: { ...state.activeFilter, ...patch },
    }));
  },

  // Computed selector for filtered tasks
  useFilteredTasks: () => {
    const { tasks, activeFilter } = get();
    return tasks.filter((task) => {
      // Filter by category
      if (activeFilter.categoryId && task.categoryId !== activeFilter.categoryId) {
        return false;
      }
      // Filter by priority
      if (activeFilter.priority && task.priority !== activeFilter.priority) {
        return false;
      }
      // Filter by completion status
      if (!activeFilter.showCompleted && task.completed) {
        return false;
      }
      return true;
    });
  },
}));

export default useAppStore;