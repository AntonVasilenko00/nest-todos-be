import { roleStub } from '../stubs'

export const mockRolesService = () => {
  return {
    getRoleByName: jest.fn().mockReturnValue(roleStub),
  }
}
