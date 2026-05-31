import { createContext, useState, useCallback, type ReactNode } from 'react';

import { categoryService } from '../services/categoryService';
import { priorityService } from '../services/priorityService';
import { todoService } from '../services/todoService';
import type { Category } from '../interfaces/Category';
import type { Priority } from '../interfaces/Priority';
import type { TodoItem } from '../interfaces/TodoItem';

interface AppContextType {
  // Categories
  categories: Category[];
  loadCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: number, name: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  searchCategories: (name: string) => Promise<void>;

  // Priorities
  priorities: Priority[];
  loadPriorities: () => Promise<void>;
  addPriority: (name: string) => Promise<void>;
  updatePriority: (id: number, name: string) => Promise<void>;
  deletePriority: (id: number) => Promise<void>;
  searchPriorities: (name: string) => Promise<void>;

  // Todos
  todos: TodoItem[];
  loadTodos: () => Promise<void>;
  addTodo: (todo: any) => Promise<void>;
  updateTodo: (id: number, todo: any) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodoComplete: (todo: TodoItem) => Promise<void>;

  // Loading & Error
  loading: boolean;
  error: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Category Methods
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (name: string) => {
    try {
      await categoryService.create({ name });
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    }
  }, [loadCategories]);

  const updateCategory = useCallback(async (id: number, name: string) => {
    try {
      await categoryService.update(id, { name });
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
    }
  }, [loadCategories]);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      await categoryService.delete(id);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  }, [loadCategories]);

  const searchCategories = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const data = await categoryService.searchByName(name);
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Priority Methods
  const loadPriorities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await priorityService.getAll();
      setPriorities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load priorities');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPriority = useCallback(async (name: string) => {
    try {
      await priorityService.create({ name });
      await loadPriorities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create priority');
    }
  }, [loadPriorities]);

  const updatePriority = useCallback(async (id: number, name: string) => {
    try {
      await priorityService.update(id, { name });
      await loadPriorities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update priority');
    }
  }, [loadPriorities]);

  const deletePriority = useCallback(async (id: number) => {
    try {
      await priorityService.delete(id);
      await loadPriorities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete priority');
    }
  }, [loadPriorities]);

  const searchPriorities = useCallback(async (name: string) => {
    setLoading(true);
    try {
      const data = await priorityService.searchByName(name);
      setPriorities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search priorities');
    } finally {
      setLoading(false);
    }
  }, []);

  // Todo Methods
  const loadTodos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await todoService.getAll();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (todo: any) => {
    try {
      await todoService.create(todo);
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    }
  }, [loadTodos]);

  const updateTodo = useCallback(async (id: number, todo: any) => {
    try {
      await todoService.update(id, todo);
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  }, [loadTodos]);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await todoService.delete(id);
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  }, [loadTodos]);

  const toggleTodoComplete = useCallback(async (todo: TodoItem) => {
    // Optimistic update
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, isCompleted: !t.isCompleted } : t));
    try {
      await todoService.update(todo.id, {
        title: todo.title,
        description: todo.description,
        categoryId: todo.categoryId,
        priorityId: todo.priorityId,
        isCompleted: !todo.isCompleted,
      });
    } catch (err) {
      // Revert on failure
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, isCompleted: todo.isCompleted } : t));
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  }, []);

  const value: AppContextType = {
    categories,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    priorities,
    loadPriorities,
    addPriority,
    updatePriority,
    deletePriority,
    searchPriorities,
    todos,
    loadTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    loading,
    error,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
