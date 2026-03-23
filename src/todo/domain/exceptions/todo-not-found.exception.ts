export class TodoNotFoundException extends Error {
  constructor(id: string) {
    super(`Todo item with ID ${id} not found`);
    this.name = 'TodoNotFoundException';
  }
}
