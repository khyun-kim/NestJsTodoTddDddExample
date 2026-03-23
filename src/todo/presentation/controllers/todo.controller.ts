import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseFilters } from "@nestjs/common";
import { ITodoService } from "../../application/interfaces/todo-service.interface";
import { CreateTodoDto } from "../dtos/create-todo.dto";
import { TodoExceptionFilter } from "../filters/todo-exception.filter";
import { UpdateTodoDto } from "../dtos/update-todo.dto";

@Controller("/api/todo")
@UseFilters(TodoExceptionFilter)
export class TodoController {
    constructor(
        @Inject(ITodoService)
        private readonly todoService: ITodoService
    ) {}
    
    @Get()
    getAll() {
        return this.todoService.findAll();
    }

    @Post()
    async create(@Body() body: CreateTodoDto) {
        await this.todoService.create(body.content);
    }

    @Patch(":id/toggle")
    async toggle(
        @Param("id") id: string
    ) {
        await this.todoService.toggleCompleted(id);
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() body: UpdateTodoDto
    ) {
        await this.todoService.update(id, body.content);
    }
}