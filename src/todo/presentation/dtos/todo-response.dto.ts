import { TodoItem } from "src/todo/domain/entities/todo-item.entity";

export class TodoResponseDto {
    id: string;
    content: string;
    isCompleted: boolean;
    createdAt: string;

    public static fromEntity(entity: TodoItem) {
        const dto = new TodoResponseDto()
        dto.id = entity.id;
        dto.content = entity.content;
        dto.isCompleted = entity.isCompleted;
        dto.createdAt = new Date(entity.createdAt).toISOString();
        return dto;
    }
}