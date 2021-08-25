import { PartialType } from '@nestjs/swagger'
import { CreateTodoDto } from './createTodo.dto'
import { IsBoolean, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator'

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @IsNotEmpty({
    message: `One of the properties 'text' or 'isCompleted' is required`,
  })
  @ValidateIf((o) => o.isCompleted === undefined)
  text?: string

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean
}
