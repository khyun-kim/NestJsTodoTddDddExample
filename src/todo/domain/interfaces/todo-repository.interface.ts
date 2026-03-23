import { TodoItem } from '../entities/todo-item.entity';

export interface ITodoRepository {
  save(item: TodoItem): Promise<void>;
  findById(id: string): Promise<TodoItem | null>;
  findAll(): Promise<TodoItem[]>;
  removeById(id: string): Promise<void>;
}

export const ITodoRepository = Symbol('ITodoRepository');
