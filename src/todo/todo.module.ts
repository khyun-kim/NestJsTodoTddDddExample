import { Module } from '@nestjs/common';
import { ITodoRepository } from './domain/interfaces/todo-repository.interface';
import { ITodoService } from './application/interfaces/todo-service.interface';
import { TodoService } from './application/services/todo.service';
import { TodoController } from './presentation/controllers/todo.controller';
import { PrismaTodoRepository } from './infrastructure/repositories/prisma-todo.repository';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: ITodoRepository,
      useClass: PrismaTodoRepository,
    },
    {
      provide: ITodoService,
      useClass: TodoService,
    },
  ],
  controllers: [TodoController],
})
export class TodoModule { }
