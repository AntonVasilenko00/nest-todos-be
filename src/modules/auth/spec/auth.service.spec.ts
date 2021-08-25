import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from '../service/auth.service'
import { JwtModule } from '@nestjs/jwt'
import { UsersService } from '../../users/service/users.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../../users/model/user.entity'
import { RolesService } from '../../roles/service/roles.service'
import { Role } from '../../roles/model/roles.entity'
import { CreateUserDto } from '../../users/dto/create-user.dto'
import * as bcrypt from 'bcrypt'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService
  let bcryptCompare: jest.Mock

  const dto: CreateUserDto = {
    email: 'abcdefg@gmail.com',
    password: '12345678',
  }

  const mockUsersRepository = {
    create: jest.fn((dto: CreateUserDto) => {
      return { id: 1, ...dto }
    }),
    save: jest.fn((dto: CreateUserDto) => {
      return { id: 1, ...dto }
    }),
    find: jest.fn(() => {}),
    findOne: jest.fn((id: number) => {
      return { id, email: 'abcdefg@gmail.com', password: '12345678' }
    }),
    delete: jest.fn(() => {}),
    update: jest.fn(() => {}),
  }

  const mockRolesRepository = {
    save: jest.fn(() => {}),
    find: jest.fn(() => {}),
    findOne: jest.fn(() => {}),
  }

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockReturnValue(false)
    ;(bcrypt.compare as jest.Mock) = bcryptCompare

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'SECRET KEY',
          signOptions: { expiresIn: process.env.JWT_EXP_TIME || '5m' },
        }),
      ],
      providers: [
        { provide: getRepositoryToken(Role), useValue: mockRolesRepository },
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        AuthService,
        RolesService,
        UsersService,
      ],
    }).compile()
    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should login user', async () => {
    bcryptCompare.mockReturnValue(true)

    expect(await service.login(dto)).toEqual({ token: expect.any(String) })
  })

  it('should signup a new user', async () => {
    mockUsersRepository.findOne.mockReturnValue(undefined)

    expect(await service.signup(dto)).toEqual({ token: expect.any(String) })
  })

  describe('when signing up with an existing email', () => {
    it('should throw a bad request error', async () => {
      mockUsersRepository.findOne.mockReturnValue({ id: 1, ...dto })
      await expect(() => service.signup(dto)).rejects.toThrow(
        'User with such email already exists',
      )
    })
  })

  describe('when logging in with an incorrect password', () => {
    it('should throw a bad request error', async () => {
      bcryptCompare.mockReturnValue(false)
      mockUsersRepository.findOne.mockReturnValue({ id: 1, ...dto })

      await expect(() => service.login(dto)).rejects.toThrow(
        'Incorrect email or password',
      )
    })
  })
})
