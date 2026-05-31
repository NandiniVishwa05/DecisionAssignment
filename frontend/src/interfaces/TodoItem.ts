import type { Category } from './Category';
import type { Priority } from './Priority';

export interface TodoItem {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  category?: Category;
  priorityId: number;
  priority?: Priority;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  description: string;
  categoryId: number;
  priorityId: number;
}

export interface UpdateTodoDto {
  title: string;
  description: string;
  categoryId: number;
  priorityId: number;
  isCompleted: boolean;
}
