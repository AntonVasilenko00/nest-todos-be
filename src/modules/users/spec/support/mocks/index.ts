import { usersArrayStub, userStub } from '../stubs'

export const mockUserRepo = () => {
  return {
    create: jest.fn().mockReturnValue(userStub),
    save: jest.fn().mockReturnValue(userStub),
    find: jest.fn().mockReturnValue(usersArrayStub),
    findOne: jest.fn().mockReturnValue(userStub),
    update: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      whereInIds: jest.fn().mockReturnThis(),
      execute: jest.fn().mockReturnValue({ raw: [userStub] }),
    })),
  }
}

export const mockUsersService = () => {
  return {
    create: jest.fn().mockReturnValue(userStub),
    findAll: jest.fn().mockReturnValue(usersArrayStub),
    findOne: jest.fn().mockReturnValue(userStub),
    update: jest.fn().mockReturnValue(userStub),
    remove: jest.fn().mockReturnValue(userStub),
    addRole: jest.fn().mockReturnValue(userStub),
    banUser: jest.fn().mockReturnValue(userStub),
    save: jest.fn().mockReturnValue(userStub),
  }
}
