import { JwtAuthGuard } from '../guards/jwtAuth.guard'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UsersService } from '../../users/service/users.service'
import { UnauthorizedException } from '@nestjs/common'
import { RolesService } from '../../roles/service/roles.service'
import { User } from '../../users/model/user.entity'
import { Role } from '../../roles/model/roles.entity'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { mockUserRepo as createMockUserRepo } from '../../users/spec/support/mocks'
import { mockRolesRepo as createMockRolesRepo } from '../../roles/spec/support/mocks'
import {
  mockExecutionContext,
  mockJwtService as createMockJwtService,
} from './support/mocks'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard

  const mockUserRepo = createMockUserRepo()
  const mockRolesRepo = createMockRolesRepo()
  const mockJwtService = createMockJwtService()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'SECRET KEY',
          signOptions: { expiresIn: process.env.JWT_EXP_TIME || '5m' },
        }),
      ],
      providers: [
        JwtAuthGuard,
        UsersService,
        RolesService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Role), useValue: mockRolesRepo },
      ],
    }).compile()

    guard = module.get<JwtAuthGuard>(JwtAuthGuard)
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })

  describe('canActivate', () => {
    describe('when authorization token is invalid', () => {
      it('should throw unauthorized exception', async () => {
        await expect(() =>
          guard.canActivate(mockExecutionContext.withInvalidToken),
        ).rejects.toThrow(UnauthorizedException)
      })
    })

    describe('when authorization token is valid', () => {
      it('should return true', async () => {
        expect(
          await guard.canActivate(mockExecutionContext.withValidToken),
        ).toEqual(true)
      })
    })

    describe('when user is banned', () => {
      it('should send proper message', async () => {
        mockUserRepo.findOne.mockReturnValue({ banned: true })

        await expect(() =>
          guard.canActivate(mockExecutionContext.withValidToken),
        ).rejects.toThrow('Your account was banned by admin')
      })
    })
  })
})
