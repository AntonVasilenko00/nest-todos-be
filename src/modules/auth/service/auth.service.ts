import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../../users/service/users.service'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import * as bcrypt from 'bcrypt'
import { User } from '../../users/model/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto)
    return this.generateToken(user)
  }

  async signup(userDto: CreateUserDto) {
    const candidate = await this.userService.findOneByEmail(userDto.email)

    if (candidate)
      throw new HttpException(
        'User with such email already exists',
        HttpStatus.BAD_REQUEST,
      )

    const hashedPassword = await bcrypt.hash(userDto.password, 10)
    const user = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    })

    return this.generateToken(user)
  }
  private async generateToken({ email, id, userRoles }: User) {
    const payload = { email, id, userRoles }

    return {
      token: this.jwtService.sign(payload),
    }
  }

  private async validateUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.userService.findOneByEmail(userDto.email)
    const passwordsMatch = await bcrypt.compare(userDto.password, user.password)

    if (user && passwordsMatch) return user

    throw new UnauthorizedException('Incorrect email or password')
  }
}
