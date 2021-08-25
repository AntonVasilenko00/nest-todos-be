import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './service/users.service'
import { UsersController } from './controller/users.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './model/user.entity'
import { Role } from '../roles/model/roles.entity'
import { RolesModule } from '../roles/roles.module'
import { RolesService } from '../roles/service/roles.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
