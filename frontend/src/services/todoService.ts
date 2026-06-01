import type { TodoItem, CreateTodoDto, UpdateTodoDto } from '../interfaces/TodoItem';
import { api } from './api';

export interface PaginatedResponse {
  data: TodoItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const todoService = {
  // Fetch all todos without pagination (large pageSize)
  getAll: async (): Promise<TodoItem[]> => {
    const response = await api.get('/todo?pageSize=1000');
    return response.data;
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
