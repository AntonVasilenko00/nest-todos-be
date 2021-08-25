import { Roles, ROLES_META_KEY } from '../decorators/roles-auth.decorator'
import { roleNamesArrayStub } from '../../roles/spec/support/stubs'

describe('RolesAuthDecorator', () => {
  it('should be defined', () => {
    expect(Roles).toBeDefined()
  })

  it('set metadata should not be empty', () => {
    @Roles(...roleNamesArrayStub)
    class TestClass {}
    expect(Reflect.getMetadata(ROLES_META_KEY, TestClass)).toBeDefined()
  })

  it('should set the metadata with proper values', () => {
    expect(Roles(...roleNamesArrayStub).KEY).toEqual(ROLES_META_KEY)

    @Roles(...roleNamesArrayStub)
    class TestClass {}
    expect(Reflect.getMetadata(ROLES_META_KEY, TestClass)).toEqual(
      roleNamesArrayStub,
    )
  })
})
