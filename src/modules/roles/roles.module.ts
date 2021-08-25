import { Module } from '@nestjs/common'
import { RolesController } from './controller/roles.controller'
import { RolesService } from './service/roles.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Role } from './model/roles.entity'
import { User } from '../users/model/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
