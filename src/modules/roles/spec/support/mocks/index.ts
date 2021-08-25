import { rolesArrayStub, roleStub } from '../stubs'

export const mockRolesRepo = () => {
  return {
    save: jest.fn(() => {}),
    find: jest.fn(() => {}),
    findOne: jest.fn(() => {}),
  }
}

export const mockRolesService = () => {
  return {
    createRole: jest.fn().mockReturnValue(roleStub),
    getRoleByName: jest.fn().mockReturnValue(roleStub),
    getAllRoles: jest.fn().mockReturnValue(rolesArrayStub),
  }
}
