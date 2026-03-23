import { TodoItem } from "../../domain/entities/todo-item.entity";
import { ITodoService } from "../../application/interfaces/todo-service.interface";
import { TodoController } from "./todo.controller"
import { Test, TestingModule } from "@nestjs/testing";
import { UpdateTodoDto } from "../dtos/update-todo.dto";
import { TodoResponseDto } from "../dtos/todo-response.dto";

describe("TodoController", () => {
    let controller: TodoController;
    let service: ITodoService;

    const mockService = () => ({
        create: jest.fn(),
        findAll: jest.fn(),
        toggleCompleted: jest.fn(),
        update: jest.fn(),
    } as ITodoService)

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TodoController],
            providers: [
                {
                    provide: ITodoService,
                    useFactory:mockService
                }
            ]
        }).compile();

        controller = module.get<TodoController>(TodoController);
        service = module.get<ITodoService>(ITodoService);
    })

    describe("getAll", () => {
        it("서비스의 findAll을 호출하고 할 일 목록을 반환해야 한다.", async () => {
            const todoList = [
                new TodoItem('content', 'id-1'), 
                new TodoItem('content2', 'id-2')
            ];
            
            // 서비스 모킹: 엔티티 배열을 반환하도록 설정
            jest.spyOn(service, 'findAll').mockResolvedValue(todoList);

            // 2. 실행: 컨트롤러 호출
            const result = await controller.getAll();

            // 3. 검증
            expect(service.findAll).toHaveBeenCalled();
            
            // 기대값도 DTO 배열로 변환해서 비교해야 합니다!
            const expectedResponse = todoList.map(TodoResponseDto.fromEntity);
            expect(result).toEqual(expectedResponse);
        })
    })

    describe('update', () => {
        it('ID와 UpdateTodoDto를 받아 서비스의 update 메서드를 호출해야 한다', async () => {
        const id = 'uuid-1234';
        const updateDto: UpdateTodoDto = { content: '수정된 할 일 내용' };

        await controller.update(id, updateDto);

        expect(service.update).toHaveBeenCalledWith(id, updateDto.content);
        });
    });

    describe('toggle', () => {
        it('ID를 받아 서비스의 toggleCompleted 메서드를 호출해야 한다', async () => {
        const id = 'uuid-5678';

        await controller.toggle(id);

        expect(service.toggleCompleted).toHaveBeenCalledWith(id);
        });
    });
})