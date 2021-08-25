import { Module } from '@nestjs/common'
import { TodosController } from './controller/todos.controller'
import { TodosService } from './service/todos.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Todo } from './model/todos.entity'
import { UsersService } from '../users/service/users.service'
import { User } from '../users/model/user.entity'
import { RolesModule } from '../roles/roles.module'

@Module({
  imports: [TypeOrmModule.forFeature([Todo, User]), RolesModule],
  controllers: [TodosController],
  providers: [TodosService, UsersService],
})
export class TodosModule {}
