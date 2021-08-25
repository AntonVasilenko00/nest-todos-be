import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../controller/users.controller'
import { UsersService } from '../service/users.service'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthGuard } from '../../auth/guards/jwtAuth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { mockUsersService as createMockUsersService } from './support/mocks'
import {
  banUserDtoStub,
  createUserDtoStub,
  updateUserDtoStub,
  usersArrayStub,
  userStub,
} from './support/stubs'
import { addRoleDtoStub } from '../../roles/spec/support/stubs'

describe('UsersController', () => {
  let controller: UsersController

  const mockUsersService = createMockUsersService()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'SECRET KEY',
          signOptions: { expiresIn: process.env.JWT_EXP_TIME || '5m' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should use JwtAuthGuard and RolesGuard', () => {
    const guards = Reflect.getMetadata('__guards__', UsersController)
    expect(guards).toContain(JwtAuthGuard)
    expect(guards).toContain(RolesGuard)
  })

  describe('create', () => {
    it('should create a new user', async () => {
      expect(await controller.create(createUserDtoStub)).toEqual(userStub)
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDtoStub)
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.create)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      expect(await controller.findAll()).toEqual(usersArrayStub)
      expect(mockUsersService.findAll).toHaveBeenCalled()
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.findAll)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      expect(await controller.findOne('1')).toEqual(userStub)
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1)
    })

    it('should give access to ADMIN and AUTHOR roles', () => {
      const roles = Reflect.getMetadata('roles', controller.findOne)
      expect(roles).toEqual(['ADMIN', 'AUTHOR'])
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      expect(await controller.update('1', updateUserDtoStub)).toEqual(userStub)
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDtoStub)
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.update)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('remove', () => {
    it('should update a user', async () => {
      expect(await controller.remove('1')).toEqual(userStub)
      expect(mockUsersService.remove).toHaveBeenCalledWith(1)
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.remove)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('addRole', () => {
    it('should add role to a user', async () => {
      expect(await controller.addRole(addRoleDtoStub, '1')).toEqual(userStub)
      expect(mockUsersService.addRole).toHaveBeenCalledWith({
        userID: 1,
        ...addRoleDtoStub,
      })
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.addRole)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('banUser', () => {
    it('should ban user', async () => {
      expect(await controller.banUser(banUserDtoStub, '1')).toEqual(userStub)
      expect(mockUsersService.banUser).toHaveBeenCalledWith({
        id: 1,
        ...banUserDtoStub,
      })
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.banUser)
      expect(roles).toEqual(['ADMIN'])
    })
  })
})
