import { Test, TestingModule } from '@nestjs/testing'
import { RolesController } from '../controller/roles.controller'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Role } from '../model/roles.entity'
import { RolesService } from '../service/roles.service'
import { CreateRoleDto } from '../dto/createRole.dto'
import exp from 'constants'

describe('RolesController', () => {
  let controller: RolesController

  const dto: CreateRoleDto = { name: 'asdfas', description: 'asdfsf' }
  const mockRole = { id: 1, name: 'asdfasfd', description: 'asdfsdf' }
  const mockRolesArray = [
    { id: 1, ...dto },
    { id: 2, ...dto },
    { id: 3, ...dto },
  ]

  const mockRolesService = {
    createRole: jest.fn().mockReturnValue(mockRole),
    getRoleByName: jest.fn().mockReturnValue(mockRole),
    getAllRoles: jest.fn().mockReturnValue(mockRolesArray),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: RolesService, useValue: mockRolesService },
      ],
      controllers: [RolesController],
    }).compile()

    controller = module.get<RolesController>(RolesController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should call create service method', async () => {
    expect(await controller.create(dto)).toEqual(mockRole)
    expect(mockRolesService.createRole).toHaveBeenCalledWith(dto)
  })

  it('should get value by name', async () => {
    const name = 'asdfs'
    expect(await controller.getByName(name)).toEqual(mockRole)
    expect(mockRolesService.getRoleByName).toHaveBeenCalledWith(name)
  })

  it('should return all roles', async () => {
    expect(await controller.getAllRoles()).toEqual(mockRolesArray)
    expect(mockRolesService.getAllRoles).toHaveBeenCalled()
  })
})
