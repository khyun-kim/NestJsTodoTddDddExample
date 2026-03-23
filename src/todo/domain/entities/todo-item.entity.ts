import { InvalidTodoContentException } from "../exceptions/invalid-todo-content.exception";

export class TodoItem {
    private _id: string;
    private _content: string;
    private _isCompleted: boolean;
    private _createdAt: number;

    constructor(content:string, id?: string) {
        this.validateContent(content);
        this._id = id ?? Math.random().toString(36).substring(2,9);
        this._content = content;
        this._isCompleted = false;
        this._createdAt = Date.now();
    }

    get id() {return this._id}
    get content() {return this._content}
    get isCompleted() {return this._isCompleted}
    get createdAt() {return this._createdAt}

    public toggleCompleted(): void {
        this._isCompleted = !this._isCompleted
    }
    
    public updateContent(content: string): void {
        this.validateContent(content);
        this._content = content;
    }

    private validateContent(content:string): void {
        if(typeof content !== "string" || content.trim().length === 0) {
            throw new InvalidTodoContentException();
        }
    }
}