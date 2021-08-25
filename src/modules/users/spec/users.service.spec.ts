import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../service/users.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../model/user.entity'
import { RolesService } from '../../roles/service/roles.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { AddRoleDto } from '../dto/add-role.dto'
import { BanUserDto } from '../dto/ban-user.dto'

describe('UsersService', () => {
  let service: UsersService

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

  const mockUserRepo = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockReturnValue(mockUser),
    find: jest.fn().mockReturnValue(mockUsers),
    findOne: jest.fn().mockReturnValue(mockUser),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      whereInIds: jest.fn().mockReturnThis(),
      execute: jest.fn().mockReturnValue({ raw: [mockUser] }),
    })),
  }

  const mockRole = { name: 'USER', description: 'user' }
  const mockSecondRole = { name: 'second role', description: 'blablasdfas' }
  const mockRolesService = {
    getRoleByName: jest.fn().mockReturnValue(mockRole),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        RolesService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: RolesService, useValue: mockRolesService },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user', async () => {
      expect(await service.create(createDto)).toEqual(mockUser)
    })

    it('should assign a basic USER role to a new user', async () => {
      expect(mockRolesService.getRoleByName).toHaveBeenCalledWith('USER')
      expect(mockUserRepo.save).toHaveBeenCalledWith({
        ...mockUser,
        roles: [mockRole],
      })
    })
  })

  describe('findAll', () => {
    it('should find all users', async () => {
      expect(await service.findAll()).toEqual(mockUsers)
      expect(mockUserRepo.find).toHaveBeenCalledWith({})
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      expect(await service.findOne(1)).toEqual(mockUser)
      expect(mockUserRepo.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('findOneByEmail', () => {
    it('should find user by email', async () => {
      expect(await service.findOneByEmail('email@gmail.com')).toEqual(mockUser)
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'email@gmail.com' },
      })
    })
  })

  describe('update', () => {
    it('should update user ', async () => {
      expect(await service.update(1, updateDto)).toEqual(mockUser)
      expect(mockUserRepo.update).toHaveBeenCalledWith(1, updateDto)
    })
  })

  describe('delete', () => {
    it('should delete user ', async () => {
      expect(await service.remove(1)).toEqual(mockUser)
      expect(mockUserRepo.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('addRole', () => {
    it('should add role to user', async () => {
      mockRolesService.getRoleByName.mockReturnValue(mockSecondRole)
      const updateRoles = [...mockUser.userRoles, mockSecondRole.name]

      expect(await service.addRole(addRoleDto)).toEqual(mockUser)

      expect(mockUserRepo.save).toHaveBeenCalledWith({
        ...mockUser,
        userRoles: updateRoles,
      })
    })
  })

  describe('banUser', () => {
    it('should ban user', async () => {
      expect(await service.banUser(banUserDto)).toEqual(mockUser)

      expect(mockUserRepo.save).toHaveBeenCalledWith({
        ...mockUser,
        banned: true,
        banReason: banUserDto.reason,
      })
    })
  })
})
