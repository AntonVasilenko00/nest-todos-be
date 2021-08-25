import { IsNotEmpty } from 'class-validator'

export class BanUserDto {
  id?: number

  @IsNotEmpty()
  reason: string
}
