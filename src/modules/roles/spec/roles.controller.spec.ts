import { Test, TestingModule } from '@nestjs/testing'
import { RolesController } from '../controller/roles.controller'
import { RolesService } from '../service/roles.service'
import { CreateRoleDto } from '../dto/createRole.dto'
import { mockRolesService as createMockRolesService } from './support/mocks'
import { createRoleDtoStub, rolesArrayStub, roleStub } from './support/stubs'

describe('RolesController', () => {
  let controller: RolesController

  const mockRolesService = createMockRolesService()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: RolesService, useValue: mockRolesService },
      ],
      controllers: [RolesController],
    }).compile()

    controller = module.get<RolesController>(RolesController)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should call create service method', async () => {
    expect(await controller.create(createRoleDtoStub)).toEqual(roleStub)
    expect(mockRolesService.createRole).toHaveBeenCalledWith(createRoleDtoStub)
  })

  it('should get value by name', async () => {
    const name = 'asdfs'
    expect(await controller.getByName(name)).toEqual(roleStub)
    expect(mockRolesService.getRoleByName).toHaveBeenCalledWith(name)
  })

  it('should return all roles', async () => {
    expect(await controller.getAllRoles()).toEqual(rolesArrayStub)
    expect(mockRolesService.getAllRoles).toHaveBeenCalled()
  })
})
