import { IsNotEmpty } from 'class-validator'

export class AddRoleDto {
  @IsNotEmpty()
  readonly name: string

  readonly userID?: number
}
