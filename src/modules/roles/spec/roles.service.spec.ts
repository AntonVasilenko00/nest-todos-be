import { Test, TestingModule } from '@nestjs/testing'
import { RolesService } from '../service/roles.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Role } from '../model/roles.entity'
import { CreateRoleDto } from '../dto/createRole.dto'

describe('RolesService', () => {
  let service: RolesService
  const dto: CreateRoleDto = {
    name: 'asdfasf',
    description: 'asdfsas',
  }
  const mockRole = { id: 1, ...dto }
  const mockRolesArray = [
    { id: 1, ...dto },
    { id: 2, ...dto },
    { id: 3, ...dto },
  ]

  beforeEach(async () => {
    let mockRolesRepo = {
      save: jest.fn().mockReturnValue(mockRole),
      findOne: jest.fn().mockReturnValue(mockRole),
      find: jest.fn().mockReturnValue(mockRolesArray),
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Role), useValue: mockRolesRepo },
      ],
    }).compile()

    service = module.get<RolesService>(RolesService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create new roles', async () => {
    expect(await service.createRole(dto)).toEqual(mockRole)
  })

  it('should get role by name', async () => {
    expect(await service.getRoleByName('asdf')).toEqual(mockRole)
  })

  it('should return all roles', async () => {
    expect(await service.getAllRoles()).toEqual(mockRolesArray)
  })
})
