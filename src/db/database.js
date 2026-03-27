import { openDB as idbOpenDB } from 'idb';
import { nanoid } from 'nanoid';

const DB_NAME = 'nicolaapp-db';
const DB_VERSION = 1;

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string|null} description
 * @property {string|null} dueDate - ISO8601 string
 * @property {'high'|'medium'|'low'} priority
 * @property {string|null} categoryId
 * @property {boolean} completed
 * @property {string} createdAt - ISO8601 string
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} color - hex color
 * @property {string} createdAt - ISO8601 string
 */

/**
 * Opens the IndexedDB connection
 * @returns {Promise<import('idb').IDBPDatabase>}
 */
export async function openDB() {
  try {
    const db = await idbOpenDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        if (oldVersion < 1) {
          // Create tasks store
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
          taskStore.createIndex('categoryId', 'categoryId', { unique: false });
          taskStore.createIndex('dueDate', 'dueDate', { unique: false });
          taskStore.createIndex('completed', 'completed', { unique: false });

          // Create categories store
          const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
          categoryStore.createIndex('name', 'name', { unique: true });
        }
      },
    });
    return db;
  } catch (error) {
    throw new Error(`Failed to open database: ${error.message}`);
  }
}

/**
 * Get all tasks
 * @returns {Promise<Task[]>}
 */
export async function getTasks() {
  try {
    const db = await openDB();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const tasks = await store.getAll();
    await tx.done;
    return tasks;
  } catch (error) {
    throw new Error(`Failed to get tasks: ${error.message}`);
  }
}

/**
 * Get task by ID
 * @param {string} id
 * @returns {Promise<Task|null>}
 */
export async function getTaskById(id) {
  try {
    const db = await openDB();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const task = await store.get(id);
    await tx.done;
    return task || null;
  } catch (error) {
    throw new Error(`Failed to get task ${id}: ${error.message}`);
  }
}

/**
 * Add a new task
 * @param {Omit<Task, 'id'|'createdAt'>} taskData
 * @returns {Promise<Task>}
 */
export async function addTask(taskData) {
  try {
    const task = {
      ...taskData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };
    const db = await openDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    await store.add(task);
    await tx.done;
    return task;
  } catch (error) {
    throw new Error(`Failed to add task: ${error.message}`);
  }
}

/**
 * Update an existing task
 * @param {Task} task
 * @returns {Promise<Task>}
 */
export async function updateTask(task) {
  try {
    const db = await openDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    await store.put(task);
    await tx.done;
    return task;
  } catch (error) {
    throw new Error(`Failed to update task ${task.id}: ${error.message}`);
  }
}

/**
 * Delete a task
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteTask(id) {
  try {
    const db = await openDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    await store.delete(id);
    await tx.done;
  } catch (error) {
    throw new Error(`Failed to delete task ${id}: ${error.message}`);
  }
}

/**
 * Get all categories
 * @returns {Promise<Category[]>}
 */
export async function getCategories() {
  try {
    const db = await openDB();
    const tx = db.transaction('categories', 'readonly');
    const store = tx.objectStore('categories');
    const categories = await store.getAll();
    await tx.done;
    return categories;
  } catch (error) {
    throw new Error(`Failed to get categories: ${error.message}`);
  }
}

/**
 * Add a new category
 * @param {Omit<Category, 'id'|'createdAt'>} categoryData
 * @returns {Promise<Category>}
 */
export async function addCategory(categoryData) {
  try {
    const category = {
      ...categoryData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
    };
    const db = await openDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    await store.add(category);
    await tx.done;
    return category;
  } catch (error) {
    throw new Error(`Failed to add category: ${error.message}`);
  }
}

/**
 * Update an existing category
 * @param {Category} category
 * @returns {Promise<Category>}
 */
export async function updateCategory(category) {
  try {
    const db = await openDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    await store.put(category);
    await tx.done;
    return category;
  } catch (error) {
    throw new Error(`Failed to update category ${category.id}: ${error.message}`);
  }
}

/**
 * Delete a category
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
  try {
    const db = await openDB();
    const tx = db.transaction('categories', 'readwrite');
    const store = tx.objectStore('categories');
    await store.delete(id);
    await tx.done;
  } catch (error) {
    throw new Error(`Failed to delete category ${id}: ${error.message}`);
  }
}