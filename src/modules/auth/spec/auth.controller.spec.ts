import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../controller/auth.controller'
import { AuthService } from '../service/auth.service'
import { UsersService } from '../../users/service/users.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { forwardRef } from '@nestjs/common'
import { UsersModule } from '../../users/users.module'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { Role } from '../../roles/model/roles.entity'
import { User } from '../../users/model/user.entity'
import { AuthModule } from '../auth.module'
import { RolesModule } from '../../roles/roles.module'
import TypeormConfig from '../../../config/ormconfig'
import { Todo } from '../../todos/model/todos.entity'
import { CreateUserDto } from '../../users/dto/create-user.dto'

describe('AuthController', () => {
  let controller: AuthController

  const mockAuthService = {
    signup: jest.fn((dto: CreateUserDto) => {
      return { token: 'fasdfasdf' }
    }),

    login: jest.fn((dto: CreateUserDto) => {
      return { token: 'fasdfasdf' }
    }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [AuthService],
      controllers: [AuthController],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should signup a user', () => {
    const dto: CreateUserDto = { email: 'abcd@gmail.com', password: '12345678' }

    expect(controller.signup(dto)).toEqual({
      token: expect.any(String),
    })

    expect(mockAuthService.signup).toHaveBeenCalledWith(dto)
  })

  it('should login a user', () => {
    const dto: CreateUserDto = { email: 'abcd@gmail.com', password: '12345678' }

    expect(controller.login(dto)).toEqual({
      token: expect.any(String),
    })

    expect(mockAuthService.login).toHaveBeenCalledWith(dto)
  })
})
