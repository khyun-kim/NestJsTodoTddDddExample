import { TodoItem } from "src/todo/domain/entities/todo-item.entity";


export interface ITodoService {
    findAll(): Promise<TodoItem[]>;
    create(content: string): Promise<void>;
    update(id:string, content:string): Promise<void>;
    toggleCompleted(id:string): Promise<void>;

}

export const ITodoService = Symbol("ITodoService");