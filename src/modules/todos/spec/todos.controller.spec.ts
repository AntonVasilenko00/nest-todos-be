import { Test, TestingModule } from '@nestjs/testing'
import { TodosController } from '../controller/todos.controller'
import { TodosService } from '../service/todos.service'
import { UsersService } from '../../users/service/users.service'
import { HttpException } from '@nestjs/common'
import { mockTodosService as createMockTodoService } from './support/mocks'
import { mockUsersService as createMockUsersService } from '../../users/spec/support/mocks'
import {
  createTodoDtoStub,
  todosArrayStub,
  todoStub,
  updateTodoDtoStub,
} from './support/stubs'

describe('TodosController', () => {
  let controller: TodosController

  const mockTodosService = createMockTodoService()
  const mockUsersService = createMockUsersService()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: TodosService, useValue: mockTodosService },
        { provide: UsersService, useValue: mockUsersService },
      ],
      controllers: [TodosController],
    }).compile()

    controller = module.get<TodosController>(TodosController)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllAction', () => {
    it('should return all todos', async () => {
      expect(await controller.getAllAction()).toEqual(todosArrayStub)
      expect(mockTodosService.findAll).toHaveBeenCalled()
    })
  })

  describe('getOneAction', () => {
    it('should return one todo', async () => {
      expect(await controller.getOneAction('1')).toEqual(todoStub)
      expect(mockTodosService.findOne).toHaveBeenCalledWith(1)
    })

    it('should throw 404 error when user is not found', async () => {
      mockTodosService.findOne.mockReturnValue(undefined)
      await expect(() => controller.getOneAction('1')).rejects.toThrow(
        HttpException,
      )
    })
  })

  describe('createAction', () => {
    it('should create a todo', async () => {
      expect(await controller.createAction(createTodoDtoStub)).toEqual(todoStub)
      expect(mockTodosService.create).toHaveBeenCalledWith(createTodoDtoStub)
    })
  })

  describe('put action', () => {
    it('should update a todo', async () => {
      expect(await controller.putAction(updateTodoDtoStub, '1')).toEqual(
        todoStub,
      )
      expect(mockTodosService.update).toHaveBeenCalledWith(1, updateTodoDtoStub)
    })

    it('should throw 404 error when user is not found', async () => {
      mockTodosService.update.mockReturnValue(undefined)
      await expect(() =>
        controller.putAction(updateTodoDtoStub, '1'),
      ).rejects.toThrow(HttpException)
    })
  })

  describe('patch action', () => {
    it('should update a todo', async () => {
      mockTodosService.update.mockReturnValue(todoStub)
      expect(await controller.patchAction(updateTodoDtoStub, '1')).toEqual(
        todoStub,
      )
      expect(mockTodosService.update).toHaveBeenCalledWith(1, updateTodoDtoStub)
    })

    it('should throw 404 error when user is not found', async () => {
      mockTodosService.update.mockReturnValue(undefined)
      await expect(() =>
        controller.putAction(updateTodoDtoStub, '1'),
      ).rejects.toThrow(HttpException)
    })
  })

  describe('delete action', () => {
    it('return deleted a todo', async () => {
      expect(await controller.deleteAction('1')).toEqual(todoStub)
      expect(mockTodosService.delete).toHaveBeenCalledWith(1)
    })

    it('should throw 404 error when user is not found', async () => {
      mockTodosService.delete.mockReturnValue(undefined)
      await expect(() => controller.deleteAction('1')).rejects.toThrow(
        HttpException,
      )
    })
  })
})
