import { rolesArrayStub, roleStub } from '../stubs'

export const mockRolesService = () => {
  return {
    createRole: jest.fn().mockReturnValue(roleStub),
    getRoleByName: jest.fn().mockReturnValue(roleStub),
    getAllRoles: jest.fn().mockReturnValue(rolesArrayStub),
  }
}
