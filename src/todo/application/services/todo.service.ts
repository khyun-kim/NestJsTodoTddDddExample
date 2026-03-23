import { Inject, Injectable } from "@nestjs/common";
import { ITodoService } from "../interfaces/todo-service.interface";
import { ITodoRepository } from "../../domain/interfaces/todo-repository.interface";
import { TodoItem } from "../../domain/entities/todo-item.entity";
import { TodoNotFoundException } from "../../domain/exceptions/todo-not-found.exception";


@Injectable()
export class TodoService implements ITodoService {
    constructor(
        @Inject(ITodoRepository)
        private readonly todoRepository: ITodoRepository,
    ) {}
    
    findAll(): Promise<TodoItem[]> {
        return this.todoRepository.findAll();
    }
    async create(content: string): Promise<void> {
        const todo = new TodoItem(content);
        await this.todoRepository.save(todo);
    }
    async update(id: string, content: string): Promise<void> {
        const todo = await this.todoRepository.findById(id);
        if(!todo) throw new TodoNotFoundException(id);
        todo.updateContent(content);
        await this.todoRepository.save(todo);
    }
    async toggleCompleted(id: string): Promise<void> {
        const todo = await this.todoRepository.findById(id);
        if(!todo) throw new TodoNotFoundException(id);
        todo.toggleCompleted();
        await this.todoRepository.save(todo);
    }
}