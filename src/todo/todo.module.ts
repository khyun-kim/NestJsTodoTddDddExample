import { Module } from "@nestjs/common";
import { ITodoRepository } from "./domain/interfaces/todo-repository.interface";
import { InMemoryTodoRepository } from "./infrastructure/repositories/in-memory-todo.repository";
import { ITodoService } from "./application/interfaces/todo-service.interface";
import { TodoService } from "./application/services/todo.service";
import { TodoController } from "./presentation/controllers/todo.controller";

@Module({
    providers:[
        {
            provide: ITodoRepository,
            useClass: InMemoryTodoRepository
        },
        {
            provide: ITodoService,
            useClass: TodoService
        }
    ],
    controllers:[TodoController]
})
export class TodoModule {}