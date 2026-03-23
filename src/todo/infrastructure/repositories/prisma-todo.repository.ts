import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/infrastructure/prisma/prisma.service";
import { TodoItem } from "src/todo/domain/entities/todo-item.entity";
import { ITodoRepository } from "src/todo/domain/interfaces/todo-repository.interface";

@Injectable()
export class PrismaTodoRepository implements ITodoRepository {
    constructor(private readonly prisma: PrismaService) { }

    save(item: TodoItem): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<TodoItem | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<TodoItem[]> {
        throw new Error("Method not implemented.");
    }
    removeById(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}