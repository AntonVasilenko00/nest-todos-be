import { JwtAuthGuard } from '../guards/jwtAuth.guard'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UsersService } from '../../users/service/users.service'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { RolesService } from '../../roles/service/roles.service'
import { User } from '../../users/model/user.entity'
import { Repository } from 'typeorm'
import { Role } from '../../roles/model/roles.entity'
import { createMock } from '@golevelup/ts-jest'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard
  const mockUserRepo = {
    findOne: jest.fn().mockReturnValue({ id: 1, banned: false }),
  }
  const mockRolesRepo = new Repository<Role>()
  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ id: 1, banned: false }),
  }
  let mockContext = createMock<ExecutionContext>()

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
        mockContext.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: 'asdfsaf',
          },
        })
        await expect(() => guard.canActivate(mockContext)).rejects.toThrow(
          UnauthorizedException,
        )
      })
    })

    describe('when authorization token is valid', () => {
      it('should return true', async () => {
        mockContext.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: 'Bearer fasdfsadf',
          },
        })
        expect(await guard.canActivate(mockContext)).toEqual(true)
      })
    })

    describe('when user is banned', () => {
      it('should send proper message', async () => {
        mockUserRepo.findOne.mockReturnValue({ banned: true })
        mockContext.switchToHttp().getRequest.mockReturnValue({
          headers: {
            authorization: 'Bearer fasdfsadf',
          },
        })

        await expect(() => guard.canActivate(mockContext)).rejects.toThrow(
          'Your account was banned by admin',
        )
      })
    })
  })
})
