import { todosArrayStub, todoStub } from '../stubs'
import { createMock } from '@golevelup/ts-jest'
import { Repository } from 'typeorm'
import { Todo } from '../../../model/todos.entity'

export const mockTodoRepo = createMock<Repository<Todo>>({
  find: jest.fn().mockReturnValue(todosArrayStub),
  findOne: jest.fn().mockReturnValue(todoStub),
  save: jest.fn().mockReturnValue(todoStub),
  update: jest.fn().mockReturnValue(todoStub),
  createQueryBuilder: jest.fn(() => ({
    delete: jest.fn().mockReturnThis(),
    whereInIds: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    execute: jest.fn().mockReturnValue({ raw: [todoStub] }),
  })),
})

export const mockTodosService = () => {
  return {
    findAll: jest.fn().mockReturnValue(todosArrayStub),
    findOne: jest.fn().mockReturnValue(todoStub),
    update: jest.fn().mockReturnValue(todoStub),
    create: jest.fn().mockReturnValue(todoStub),
    delete: jest.fn().mockReturnValue(todoStub),
  }
}
