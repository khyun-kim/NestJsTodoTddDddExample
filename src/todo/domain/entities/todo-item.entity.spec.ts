import { InvalidTodoContentException } from "../exceptions/invalid-todo-content.exception";
import { TodoItem } from "./todo-item.entity";

describe("TodoItem Entity (Domain)", () => {
    const validContent = "Todo Example";
    const invalidContent = "";
    describe("생성 (Creation)", () => {
        it("유효한 내용이 주어지면 TodoItem 인스턴스를 생성해야 한다", () => {
            const todo = new TodoItem(validContent);
            expect(todo).toBeDefined();
            expect(todo.content).toEqual(validContent);
            expect(todo.isCompleted).toBeFalsy();
            expect(todo.createdAt).toBeDefined();
        })
        it("유효하지 않은 내용이 주어지면 오류를 발생해야 한다", () => {
            expect(() => new TodoItem(invalidContent)).toThrow(InvalidTodoContentException);
        })
    })
    describe("완료 토글 (Update)", () => {
        it("toggleCompleted를 호출하여 완료 상태를 변경할 수 있어야 한다", () => {
            const todo = new TodoItem(validContent);
            expect(todo).toBeDefined();
            expect(todo.content).toEqual(validContent);
            expect(todo.isCompleted).toBeFalsy();
            expect(todo.createdAt).toBeDefined();
            todo.toggleCompleted();
            expect(todo.isCompleted).toBeTruthy();
            todo.toggleCompleted();
            expect(todo.isCompleted).toBeFalsy();
        })
    });
    describe("내용 변경 (Update)", () => {
        it("content를 수정할 수 있어야 한다", () => {
            const updateContent = "수정사항"
            const todo = new TodoItem(validContent);
            expect(todo).toBeDefined();
            expect(todo.content).toEqual(validContent);
            expect(todo.isCompleted).toBeFalsy();
            expect(todo.createdAt).toBeDefined();
            todo.updateContent(updateContent);
            expect(todo.content).toEqual(updateContent);
        })
        it("유효하지 않은 내용으로 변경하려고 하면 오류를 발생해야 한다", () => {
            const todo = new TodoItem(validContent);
            expect(todo).toBeDefined();
            expect(todo.content).toEqual(validContent);
            expect(todo.isCompleted).toBeFalsy();
            expect(todo.createdAt).toBeDefined();
            expect(() => todo.updateContent(invalidContent)).toThrow(InvalidTodoContentException);
        })
    })
});