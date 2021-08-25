import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../service/users.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../model/user.entity'
import { RolesService } from '../../roles/service/roles.service'
import { AddRoleDto } from '../dto/add-role.dto'
import { mockUserRepo as createMockUserRepo } from './support/mocks'
import { mockRolesService as createMockRolesService } from '../../roles/spec/support/mocks'
import {
  userStub,
  usersArrayStub,
  createUserDtoStub,
  updateUserDtoStub,
  banUserDtoStub,
} from './support/stubs'
import {
  addRoleDtoStub,
  anotherRoleStub,
  roleStub,
} from '../../roles/spec/support/stubs'

describe('UsersService', () => {
  let service: UsersService
  const mockUserRepo = createMockUserRepo()
  const mockRolesService = createMockRolesService()

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

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    let user: User

    beforeEach(async () => {
      user = await service.create(createUserDtoStub)
    })

    it('should create a new user', async () => {
      expect(user).toEqual(userStub)
    })

    it('should assign a basic USER role to a new user', async () => {
      expect(mockRolesService.getRoleByName).toHaveBeenCalledWith('USER')
      expect(mockUserRepo.save).toHaveBeenCalledWith({
        ...userStub,
        roles: [roleStub],
      })
    })
  })

  describe('findAll', () => {
    it('should find all users', async () => {
      expect(await service.findAll()).toEqual(usersArrayStub)
      expect(mockUserRepo.find).toHaveBeenCalledWith({})
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      expect(await service.findOne(1)).toEqual(userStub)
      expect(mockUserRepo.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('findOneByEmail', () => {
    it('should find user by email', async () => {
      expect(await service.findOneByEmail('email@gmail.com')).toEqual(userStub)
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'email@gmail.com' },
      })
    })
  })

  describe('update', () => {
    it('should update user ', async () => {
      expect(await service.update(1, updateUserDtoStub)).toEqual(userStub)
      expect(mockUserRepo.update).toHaveBeenCalledWith(1, updateUserDtoStub)
    })
  })

  describe('delete', () => {
    it('should delete user ', async () => {
      expect(await service.remove(1)).toEqual(userStub)
      expect(mockUserRepo.createQueryBuilder).toHaveBeenCalled()
    })
  })

  describe('addRole', () => {
    it('should add role to user', async () => {
      mockRolesService.getRoleByName.mockReturnValue(anotherRoleStub)
      const updateRoles = [...userStub.userRoles, anotherRoleStub.name]

      expect(await service.addRole(addRoleDtoStub)).toEqual(userStub)

      expect(mockUserRepo.save).toHaveBeenCalledWith({
        ...userStub,
        userRoles: updateRoles,
      })
    })
  })

  describe('banUser', () => {
    it('should ban user', async () => {
      expect(await service.banUser(banUserDtoStub)).toEqual(userStub)

      expect(mockUserRepo.save).toHaveBeenCalledWith({
        ...userStub,
        banned: true,
        banReason: banUserDtoStub.reason,
      })
    })
  })
})
