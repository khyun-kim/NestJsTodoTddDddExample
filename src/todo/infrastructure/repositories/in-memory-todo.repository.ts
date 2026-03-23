import { Injectable } from "@nestjs/common";
import { TodoItem } from "src/todo/domain/entities/todo-item.entity";
import { ITodoRepository } from "src/todo/domain/interfaces/todo-repository.interface";

@Injectable()
export class InMemoryTodoRepository implements ITodoRepository {
    private items:Map<string, TodoItem> = new Map();

    async save(item: TodoItem): Promise<void> {
        this.items.set(item.id, item);
    }
    async findById(id: string): Promise<TodoItem | null> {
        const item = this.items.get(id);
        if(!item) return null;
        return item;
    }
    async findAll(): Promise<TodoItem[]> {
        return Array.from(this.items.values());
    }
    async removeById(id: string): Promise<void> {
        this.items.delete(id);
    }
}