import { Test, TestingModule } from '@nestjs/testing'
import { TodosController } from '../controller/todos.controller'
import { Todo } from '../model/todos.entity'
import { TodosService } from '../service/todos.service'
import { UsersService } from '../../users/service/users.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../../users/model/user.entity'
import { CreateTodoDto, UpdateTodoDto } from '../dto'
import { HttpException, NotFoundException } from '@nestjs/common'

describe('TodosController', () => {
  let controller: TodosController

  const someTodos: Todo[] = [new Todo()]
  const mockTodo: Todo = {
    id: 1,
    userID: 1,
    isCompleted: false,
    text: 'asdf',
    user: new User(),
  }
  const mockTodosService = {
    findAll: jest.fn().mockReturnValue(someTodos),
    findOne: jest.fn().mockReturnValue(mockTodo),
    create: jest.fn().mockReturnValue(mockTodo),
    update: jest.fn().mockReturnValue(mockTodo),
    delete: jest.fn().mockReturnValue(mockTodo),
  }

  const createDto: CreateTodoDto = { userID: 1, text: 'asdf' }
  const updateDto: UpdateTodoDto = { isCompleted: false }
  const mockUsersService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: TodosService, useValue: mockTodosService },
        { provide: UsersService, useValue: mockUsersService },
      ],
      controllers: [TodosController],
    }).compile()

    controller = module.get<TodosController>(TodosController)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllAction', () => {
    it('should return all todos', async () => {
      expect(await controller.getAllAction()).toEqual(someTodos)
      expect(mockTodosService.findAll).toHaveBeenCalled()
    })
  })

  describe('getOneAction', () => {
    it('should return one todo', async () => {
      expect(await controller.getOneAction('1')).toEqual(mockTodo)
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
      expect(await controller.createAction(createDto)).toEqual(mockTodo)
      expect(mockTodosService.create).toHaveBeenCalledWith(createDto)
    })
  })

  describe('put action', () => {
    it('should update a todo', async () => {
      expect(await controller.putAction(updateDto, '1')).toEqual(mockTodo)
      expect(mockTodosService.update).toHaveBeenCalledWith(1, updateDto)
    })

    it('should throw 404 error when user is not found', async () => {
      mockTodosService.update.mockReturnValue(undefined)
      await expect(() => controller.putAction(updateDto, '1')).rejects.toThrow(
        HttpException,
      )
    })
  })

  describe('patch action', () => {
    it('should update a todo', async () => {
      mockTodosService.update.mockReturnValue(mockTodo)
      expect(await controller.patchAction(updateDto, '1')).toEqual(mockTodo)
      expect(mockTodosService.update).toHaveBeenCalledWith(1, updateDto)
    })

    it('should throw 404 error when user is not found', async () => {
      mockTodosService.update.mockReturnValue(undefined)
      await expect(() => controller.putAction(updateDto, '1')).rejects.toThrow(
        HttpException,
      )
    })
  })

  describe('delete action', () => {
    it('return deleted a todo', async () => {
      expect(await controller.deleteAction('1')).toEqual(mockTodo)
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
