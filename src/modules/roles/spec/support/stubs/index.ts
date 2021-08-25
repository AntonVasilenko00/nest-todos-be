import { AddRoleDto } from '../../../../users/dto/add-role.dto'
import { CreateRoleDto } from '../../../dto/createRole.dto'

export const roleStub = { name: 'USER', description: 'user' }

export const anotherRoleStub = {
  name: 'second role',
  description: 'blablasdfas',
}

export const rolesArrayStub = [roleStub]

export const addRoleDtoStub: AddRoleDto = {
  name: 'asfs',
}

export const createRoleDtoStub: CreateRoleDto = {
  description: 'asdfasdf',
  name: 'asdfasf',
}
