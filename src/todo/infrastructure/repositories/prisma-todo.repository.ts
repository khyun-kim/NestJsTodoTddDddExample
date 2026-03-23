import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../shared/infrastructure/prisma/prisma.service";
import { TodoItem } from "../../../todo/domain/entities/todo-item.entity";
import { ITodoRepository } from "../../../todo/domain/interfaces/todo-repository.interface";

@Injectable()
export class PrismaTodoRepository implements ITodoRepository {
    constructor(private readonly prisma: PrismaService) { }

    async save(item: TodoItem): Promise<void> {
        await this.prisma.todo.upsert({
            where: { id: item.id },
            update: { content: item.content, isCompleted: item.isCompleted },
            create: { id: item.id, content: item.content, isCompleted: item.isCompleted, createdAt: item.createdAt }
        })
    }
    async findById(id: string): Promise<TodoItem | null> {
        const data = await this.prisma.todo.findUnique({ where: { id } });
        if (!data) return null;
        return new TodoItem(data.content, data.id, data.isCompleted, data.createdAt)
    }
    async findAll(): Promise<TodoItem[]> {
        const data = await this.prisma.todo.findMany();
        return data.map((v) => new TodoItem(v.content, v.id, v.isCompleted, v.createdAt));
    }
    async removeById(id: string): Promise<void> {
        await this.prisma.todo.delete({ where: { id } });
    }

}