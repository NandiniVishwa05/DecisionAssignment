import { api } from './api';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../interfaces/Category';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    return api.get('/category');
  },

  searchByName: async (name: string): Promise<Category[]> => {
    return api.get(`/category/search?name=${encodeURIComponent(name)}`);
  },

  create: async (data: CreateCategoryDto): Promise<Category> => {
    return api.post('/category', data);
  },

  update: async (id: number, data: UpdateCategoryDto): Promise<Category> => {
    return api.put(`/category/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete(`/category/${id}`);
  },
};
