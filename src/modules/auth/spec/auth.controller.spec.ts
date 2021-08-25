import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from '../controller/auth.controller'
import { AuthService } from '../service/auth.service'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import { mockAuthService as createMockAuthService } from './support/mocks'

describe('AuthController', () => {
  let controller: AuthController

  const mockAuthService = createMockAuthService()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      controllers: [AuthController],
    })
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
