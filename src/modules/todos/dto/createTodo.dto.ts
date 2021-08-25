import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateTodoDto {
  userID: number

  @ApiProperty()
  @IsNotEmpty()
  text: string

  @ApiProperty()
  isCompleted?: boolean
}
