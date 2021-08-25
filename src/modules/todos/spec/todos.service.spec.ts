import { Test, TestingModule } from '@nestjs/testing'
import { TodosService } from '../service/todos.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Todo } from '../model/todos.entity'
import { CreateTodoDto, UpdateTodoDto } from '../dto'
import { createMock } from '@golevelup/ts-jest'
import { Repository } from 'typeorm'

describe('TodosService', () => {
  let service: TodosService
  const mockTodos = [new Todo()]
  const mockTodo = new Todo()
  const createDto: CreateTodoDto = {
    text: 'asdfsadf',
    userID: 1,
  }
  const updateDto: UpdateTodoDto = {
    isCompleted: true,
  }

  // const mockTodoRepo = {
  //   find: jest.fn().mockReturnValue(mockTodos),
  //   findOne: jest.fn().mockReturnValue(mockTodo),
  //   save: jest.fn().mockReturnValue(mockTodo),
  //   delete: jest.fn().mockReturnValue(mockTodo),
  // }
  const mockTodoRepo = createMock<Repository<Todo>>({
    find: jest.fn().mockReturnValue(mockTodos),
    findOne: jest.fn().mockReturnValue(mockTodo),
    save: jest.fn().mockReturnValue(mockTodo),
    update: jest.fn().mockReturnValue(mockTodo),
    createQueryBuilder: jest.fn(() => ({
      delete: jest.fn().mockReturnThis(),
      whereInIds: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
      execute: jest.fn().mockReturnValue({ raw: [mockTodo] }),
    })),
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: getRepositoryToken(Todo), useValue: mockTodoRepo },
      ],
    }).compile()

    service = module.get<TodosService>(TodosService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return array of todos', async () => {
      expect(await service.findAll()).toEqual(mockTodos)
      expect(mockTodoRepo.find).toHaveBeenCalledWith({})
    })

    it('should find todos with condition', async () => {
      const someCondition = { userID: 1 }
      expect(await service.findAll(someCondition)).toEqual(mockTodos)
      expect(mockTodoRepo.find).toHaveBeenCalledWith({ where: someCondition })
    })
  })

  describe('findOne', () => {
    it('should return a todo', async () => {
      expect(await service.findOne(1)).toEqual(mockTodo)
      expect(mockTodoRepo.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('create', () => {
    it('should create a todo', async () => {
      expect(await service.create(createDto)).toEqual(mockTodo)
      expect(mockTodoRepo.save).toHaveBeenCalledWith(createDto)
    })
  })

  describe('update', () => {
    it('should update a todo', async () => {
      expect(await service.update(1, updateDto)).toEqual(mockTodo)
      expect(mockTodoRepo.update).toHaveBeenCalledWith(1, updateDto)
    })
  })

  describe('delete', () => {
    it('should delete a todo', async () => {
      expect(await service.delete(1)).toEqual(mockTodo)
      expect(mockTodoRepo.createQueryBuilder).toHaveBeenCalled()
    })
  })
})
