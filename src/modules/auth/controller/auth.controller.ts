import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { AuthService } from '../service/auth.service'

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/login')
  login(@Body() userDto: CreateUserDto): Promise<{ token: string }> {
    return this.service.login(userDto)
  }

  @Post('/signup')
  signup(@Body() userDto: CreateUserDto): Promise<{ token: string }> {
    return this.service.signup(userDto)
  }
}
