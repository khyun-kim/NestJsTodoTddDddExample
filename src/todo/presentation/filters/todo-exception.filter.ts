import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InvalidTodoContentException } from '../../domain/exceptions/invalid-todo-content.exception';
import { TodoNotFoundException } from '../../domain/exceptions/todo-not-found.exception';

@Catch(InvalidTodoContentException, TodoNotFoundException)
export class TodoExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '서버 내부 에러가 발생했습니다.';
    let errorName = 'InternalServerError';

    if (exception instanceof InvalidTodoContentException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      errorName = exception.name;
    } else if (exception instanceof TodoNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
      errorName = exception.name;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse() as any;
      message = responseBody.message ?? exception.message;
      errorName = exception.name;
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
