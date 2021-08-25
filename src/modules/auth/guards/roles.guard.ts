import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { ROLES_META_KEY } from '../decorators/roles-auth.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_META_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!allowedRoles) return true

    const req = context.switchToHttp().getRequest()

    try {
      const token = req.headers.authorization.split(' ')[1]

      if (!token) throw new UnauthorizedException('User is not authorized')

      const user = this.jwtService.verify(token)
      req.user = user

      if (allowedRoles.includes('AUTHOR') && +req.params.id === req.user.id)
        return true

      return user.userRoles.some((role: string) => allowedRoles.includes(role))
    } catch (e) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN)
    }
  }
}
