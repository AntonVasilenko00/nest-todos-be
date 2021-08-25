import { Routes } from '@nestjs/core'
import { UsersModule } from './modules/users/users.module'
import { TodosModule } from './modules/todos/todos.module'

export const routes: Routes = [
  {
    path: 'admin',
    children: [{ path: 'todos', module: TodosModule }],
  },
  {
    path: 'users',
    module: UsersModule,
    children: [{ path: ':userID/todos', module: TodosModule }],
  },
]
