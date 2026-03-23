export class InvalidTodoContentException extends Error {
    constructor() {
        super("TodoItem's content must be not empty.")
    }
}