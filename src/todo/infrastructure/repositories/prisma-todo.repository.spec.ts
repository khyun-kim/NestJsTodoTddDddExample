// src/todo/infrastructure/repositories/prisma-todo.repository.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaTodoRepository } from './prisma-todo.repository';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { TodoItem } from '../../domain/entities/todo-item.entity';

describe('PrismaTodoRepository', () => {
    let repository: PrismaTodoRepository;
    let prismaMock: DeepMockProxy<PrismaService>;

    beforeEach(async () => {
        // 1. PrismaService를 깊은 모킹(Deep Mock) 처리합니다.
        prismaMock = mockDeep<PrismaService>();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PrismaTodoRepository,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        repository = module.get<PrismaTodoRepository>(PrismaTodoRepository);
    });

    describe('save', () => {
        it('도메인 엔티티를 받아 Prisma의 upsert를 올바르게 호출해야 한다', async () => {
            // Given
            const todo = new TodoItem('단위 테스트 작성하기');

            // When
            await repository.save(todo);

            // Then
            expect(prismaMock.todo.upsert).toHaveBeenCalledWith({
                where: { id: todo.id },
                update: { content: todo.content, isCompleted: todo.isCompleted },
                create: {
                    id: todo.id,
                    content: todo.content,
                    isCompleted: todo.isCompleted,
                    createdAt: todo.createdAt,
                },
            });
        });
    });

    describe('findById', () => {
        it('데이터가 존재할 경우 도메인 엔티티 TodoItem 인스턴스를 반환해야 한다', async () => {
            // Given
            const mockDbData = new TodoItem(
                '테스트 내용',
                'test-id',
                false,
                Date.now()
            );

            // Prisma 리턴값 모킹
            prismaMock.todo.findUnique.mockResolvedValue(mockDbData);

            // When
            const result = await repository.findById('test-id');

            // Then
            expect(result).toBeInstanceOf(TodoItem);
            expect(result?.id).toBe(mockDbData.id);
            expect(result?.content).toBe(mockDbData.content);
        });

        it('데이터가 없을 경우 null을 반환해야 한다', async () => {
            prismaMock.todo.findUnique.mockResolvedValue(null);
            const result = await repository.findById('non-existent');
            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('조회된 모든 데이터를 도메인 엔티티 배열로 변환하여 반환해야 한다', async () => {
            // Given
            const mockList = [
                new TodoItem(
                    '테스트 내용',
                    'test-id-1',
                    false,
                    Date.now()
                ),
                new TodoItem(
                    '두 번째',
                    'test-id-2',
                    false,
                    Date.now()
                ),
            ];
            prismaMock.todo.findMany.mockResolvedValue(mockList);

            // When
            const result = await repository.findAll();

            // Then
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(TodoItem);
            expect(result[1].content).toBe('두 번째');
        });
    });
});