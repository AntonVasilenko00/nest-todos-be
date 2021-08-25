import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../../users/service/users.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()

    try {
      const token = req.headers.authorization.split(' ')[1]

      if (!token) throw new UnauthorizedException('User is not authorized')

      const user = this.jwtService.verify(token)
      req.user = user

      const userData = await this.userService.findOne(user.id)
      if (userData.banned)
        throw new UnauthorizedException({
          message: 'Your account was banned by admin',
          banReason: userData.banReason,
        })

      return true
    } catch (e) {
      throw new UnauthorizedException(e.message || 'User is not authorized')
    }
  }
}
