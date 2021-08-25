import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TodosModule } from './modules/todos/todos.module'
import TypeormConfig from './config/ormconfig'
import { Connection } from 'typeorm'
import { UsersModule } from './modules/users/users.module'
import { RouterModule } from '@nestjs/core'
import { routes } from './routes'
import { AuthModule } from './modules/auth/auth.module'
import { RolesModule } from './modules/roles/roles.module'

@Module({
  imports: [
    RouterModule.register(routes),
    TypeOrmModule.forRoot(TypeormConfig),
    UsersModule,
    TodosModule,
    AuthModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
