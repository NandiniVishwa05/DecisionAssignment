import type { Priority, CreatePriorityDto, UpdatePriorityDto } from '../interfaces/Priority';
import { api } from './api';

export const priorityService = {
  getAll: async (): Promise<Priority[]> => {
    return api.get('/priority');
  },

  searchByName: async (name: string): Promise<Priority[]> => {
    return api.get(`/priority/search?name=${encodeURIComponent(name)}`);
  },

  create: async (data: CreatePriorityDto): Promise<Priority> => {
    return api.post('/priority', data);
  },

  update: async (id: number, data: UpdatePriorityDto): Promise<Priority> => {
    return api.put(`/priority/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete(`/priority/${id}`);
  },
};
