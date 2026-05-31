import type { TodoItem, CreateTodoDto, UpdateTodoDto } from '../interfaces/TodoItem';
import { api } from './api';

export const todoService = {
   getAll: async (): Promise<TodoItem[]> => {
    const response = await api.get('/todo');
    return response.data; // ← extract the array
  },

  getById: async (id: number): Promise<TodoItem> => {
    return api.get(`/todo/${id}`);
  },

  create: async (data: CreateTodoDto): Promise<TodoItem> => {
    return api.post('/todo', data);
  },

  update: async (id: number, data: UpdateTodoDto): Promise<TodoItem> => {
    return api.put(`/todo/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete(`/todo/${id}`);
  },
};
