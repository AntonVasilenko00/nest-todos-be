import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './controller/auth.controller'
import { AuthService } from './service/auth.service'
import { UsersModule } from '../users/users.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET KEY',
      signOptions: { expiresIn: process.env.JWT_EXP_TIME || '5m' },
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
