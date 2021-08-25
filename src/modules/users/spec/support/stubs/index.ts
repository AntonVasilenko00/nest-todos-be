import { User } from '../../../model/user.entity'
import { CreateUserDto } from '../../../dto/create-user.dto'
import { UpdateUserDto } from '../../../dto/update-user.dto'
import { BanUserDto } from '../../../dto/ban-user.dto'

export const userStub: User = {
  banReason: '',
  banned: false,
  email: 'blablabla@gmail.com ',
  id: 1,
  password: '12345678',
  roles: [],
  todos: [],
  userRoles: [],
}

export const usersArrayStub: User[] = [userStub]

export const createUserDtoStub: CreateUserDto = {
  email: 'blablabla@gmail.com',
  password: '12345678',
}

export const updateUserDtoStub: UpdateUserDto = {
  email: 'badsfas@gmail.com',
}

export const banUserDtoStub: BanUserDto = {
  reason: 'bad behaviour',
}
