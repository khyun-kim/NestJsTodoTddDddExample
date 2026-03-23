import { TodoItem } from '../../domain/entities/todo-item.entity';
import { InMemoryTodoRepository } from './in-memory-todo.repository';

describe('InMemoryTodoRepository', () => {
  let repository: InMemoryTodoRepository;

  beforeEach(() => {
    repository = new InMemoryTodoRepository();
  });

  it('save()를 통해 할 일을 저장하고 findById()로 찾을 수 있어야 한다', async () => {
    const todo = new TodoItem('테스트 할 일', 'uuid-1');
    
    await repository.save(todo);
    const found = await repository.findById('uuid-1');

    expect(found).toEqual(todo);
    expect(found?.id).toBe('uuid-1');
  });

  it('존재하지 않는 ID로 조회하면 null을 반환해야 한다', async () => {
    const found = await repository.findById('non-existent');
    expect(found).toBeNull();
  });

  it('findAll()은 저장된 모든 할 일을 배열로 반환해야 한다', async () => {
    const todo1 = new TodoItem('일 1', 'id-1');
    const todo2 = new TodoItem('일 2', 'id-2');

    await repository.save(todo1);
    await repository.save(todo2);

    const all = await repository.findAll();

    expect(all).toHaveLength(2);
    expect(all).toContain(todo1);
    expect(all).toContain(todo2);
  });

  it('remove()는 해당 ID의 할 일을 삭제해야 한다', async () => {
    const todo = new TodoItem('삭제될 일', 'id-1');
    await repository.save(todo);

    await repository.removeById('id-1');
    const found = await repository.findById('id-1');

    expect(found).toBeNull();
  });
});