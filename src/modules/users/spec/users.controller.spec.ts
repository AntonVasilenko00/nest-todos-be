import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../controller/users.controller'
import { UsersService } from '../service/users.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { JwtAuthGuard } from '../../auth/guards/jwtAuth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import exp from 'constants'
import { CreateUserDto } from '../dto/create-user.dto'
import { AddRoleDto } from '../dto/add-role.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { BanUserDto } from '../dto/ban-user.dto'
import { User } from '../model/user.entity'

describe('UsersController', () => {
  let controller: UsersController

  const createDto: CreateUserDto = {
    email: 'blablabla@gmail.com',
    password: '12345678',
  }

  const addRoleDto: AddRoleDto = {
    name: 'asfs',
  }

  const updateDto: UpdateUserDto = {
    email: 'badsfas@gmail.com',
  }

  const banUserDto: BanUserDto = {
    reason: 'bad behaviour',
  }

  const mockUser: User = {
    banReason: '',
    banned: false,
    email: 'blablabla@gmail.com ',
    id: 1,
    password: '12345678',
    roles: [],
    todos: [],
    userRoles: [],
  }

  const mockUsers = [new User()]

  const mockUsersService = {
    create: jest.fn().mockReturnValue(mockUser),
    findAll: jest.fn().mockReturnValue(mockUsers),
    findOne: jest.fn().mockReturnValue(mockUser),
    update: jest.fn().mockReturnValue(mockUser),
    remove: jest.fn().mockReturnValue(mockUser),
    addRole: jest.fn().mockReturnValue(mockUser),
    banUser: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockReturnValue(mockUser),
  }

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
      expect(await controller.create(createDto)).toEqual(mockUser)
      expect(mockUsersService.create).toHaveBeenCalledWith(createDto)
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.create)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      expect(await controller.findAll()).toEqual(mockUsers)
      expect(mockUsersService.findAll).toHaveBeenCalled()
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.findAll)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      expect(await controller.findOne('1')).toEqual(mockUser)
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1)
    })

    it('should give access to ADMIN and AUTHOR roles', () => {
      const roles = Reflect.getMetadata('roles', controller.findOne)
      expect(roles).toEqual(['ADMIN', 'AUTHOR'])
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      expect(await controller.update('1', updateDto)).toEqual(mockUser)
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateDto)
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.update)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('remove', () => {
    it('should update a user', async () => {
      expect(await controller.remove('1')).toEqual(mockUser)
      expect(mockUsersService.remove).toHaveBeenCalledWith(1)
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.remove)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('addRole', () => {
    it('should add role to a user', async () => {
      expect(await controller.addRole(addRoleDto, '1')).toEqual(mockUser)
      expect(mockUsersService.addRole).toHaveBeenCalledWith({
        userID: 1,
        ...addRoleDto,
      })
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.addRole)
      expect(roles).toEqual(['ADMIN'])
    })
  })

  describe('banUser', () => {
    it('should ban user', async () => {
      expect(await controller.banUser(banUserDto, '1')).toEqual(mockUser)
      expect(mockUsersService.banUser).toHaveBeenCalledWith({
        id: 1,
        ...banUserDto,
      })
    })

    it('should give access only to ADMIN role', () => {
      const roles = Reflect.getMetadata('roles', controller.banUser)
      expect(roles).toEqual(['ADMIN'])
    })
  })
})
