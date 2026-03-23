import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TodoExceptionFilter } from './todo-exception.filter';
import { InvalidTodoContentException } from '../../domain/exceptions/invalid-todo-content.exception';
import { TodoNotFoundException } from '../../domain/exceptions/todo-not-found.exception';

describe('TodoExceptionFilter', () => {
  let filter: TodoExceptionFilter;
  let mockResponse: any;
  let mockArgumentsHost: any;

  beforeEach(() => {
    filter = new TodoExceptionFilter();

    // 1. Response 객체 Mocking (Chaining을 위해 status가 자신을 반환하게 함)
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // 2. ArgumentsHost Mocking
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    } as unknown as ArgumentsHost;
  });

  it('InvalidTodoContentException이 발생하면 400 에러를 반환해야 한다', () => {
    const exception = new InvalidTodoContentException();

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: exception.name,
        statusCode: 400,
        message: exception.message,
      }),
    );
  });

  it('TodoNotFoundException이 발생하면 404 에러를 반환해야 한다', () => {
    const exception = new TodoNotFoundException('uuid-1');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: exception.name,
        statusCode: 404,
        message: exception.message,
      }),
    );
  });

  it('일반적인 에러가 발생하면 500 에러를 반환해야 한다', () => {
    const exception = new Error('예상치 못한 서버 에러');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  });

  it('HttpException이 발생하면 해당 정보를 반환해야 한다', () => {
    const exception = new BadRequestException();
    filter.catch(exception, mockArgumentsHost);
    expect(mockResponse.status).toHaveBeenCalledWith(exception.getStatus());
  });
});
