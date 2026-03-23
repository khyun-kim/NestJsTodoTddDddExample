import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: '할 일은 최소 1자 이상이어야 합니다.' })
  content: string;
}
