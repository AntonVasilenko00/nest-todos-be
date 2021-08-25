import { Roles, ROLES_META_KEY } from '../decorators/roles-auth.decorator'

describe('RolesAuthDecorator', () => {
  const decorator = Roles

  it('should be defined', () => {
    expect(Roles).toBeDefined()
  })

  it('metadata should not be empty', () => {
    const rolesArray = ['ADMIN', 'VASYA']
    @Roles(...rolesArray)
    class TestClass {}
    expect(Reflect.getMetadata(ROLES_META_KEY, TestClass)).toBeDefined()
  })

  it('should set the metadata with proper values', () => {
    const rolesArray = ['ADMIN', 'VASYA']
    @Roles(...rolesArray)
    class TestClass {}
    expect(Reflect.getMetadata(ROLES_META_KEY, TestClass)).toEqual(rolesArray)
  })
})
