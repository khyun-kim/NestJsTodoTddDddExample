import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { ITodoRepository } from '../../domain/interfaces/todo-repository.interface';
import { TodoItem } from '../../domain/entities/todo-item.entity';
import { TodoNotFoundException } from '../../domain/exceptions/todo-not-found.exception';

describe('TodoService', () => {
  let service: TodoService;
  let repository: ITodoRepository;

  const mockRepository = () => ({
    save: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: ITodoRepository, useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<ITodoRepository>(ITodoRepository);
  });

  describe('findAll', () => {
    it('모든 할 일 목록을 반환해야 한다', async () => {
      const todoList = [
        new TodoItem('할 일 1', 'uuid-1'),
        new TodoItem('할 일 2', 'uuid-2'),
      ];
      jest.spyOn(repository, 'findAll').mockResolvedValue(todoList);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result).toEqual(todoList);
    });

    it('목록이 비어있으면 빈 배열을 반환해야 한다', async () => {
      jest.spyOn(repository, 'findAll').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('create', () => {
    it('새로운 할 일을 정상적으로 생성하고 저장해야 한다', async () => {
      const content = 'TDD 공부하기';

      await service.create(content);

      expect(repository.save).toHaveBeenCalledWith(expect.any(TodoItem));
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ _content: content }),
      );
    });
  });

  describe('updateContent', () => {
    it('존재하는 할 일의 내용을 변경하고 저장해야 한다', async () => {
      const existingTodo = new TodoItem('기존 할 일', 'uuid-1');
      jest.spyOn(repository, 'findById').mockResolvedValue(existingTodo);

      await service.update('uuid-1', '변경된 할 일');

      expect(existingTodo.content).toEqual('변경된 할 일');
      expect(repository.save).toHaveBeenCalledWith(existingTodo);
    });

    it('존재하지 않는 할 일의 내용을 변경하고자 하면 오류가 발생해야 한다', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);
      await expect(service.update('non-exists', 'test')).rejects.toThrow(
        TodoNotFoundException,
      );
    });
  });

  describe('toggleCompleted', () => {
    it('존재하는 할 일의 상태를 반전시키고 저장해야 한다', async () => {
      const existingTodo = new TodoItem('기존 할 일', 'uuid-1');
      const initialStatus = existingTodo.isCompleted; // false
      jest.spyOn(repository, 'findById').mockResolvedValue(existingTodo);

      await service.toggleCompleted('uuid-1');

      expect(existingTodo.isCompleted).toBe(!initialStatus);
      expect(repository.save).toHaveBeenCalledWith(existingTodo);
    });

    it('할 일이 없으면 에러를 던져야 한다', async () => {
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      await expect(service.toggleCompleted('wrong-id')).rejects.toThrow(
        TodoNotFoundException,
      );
    });
  });
});
