import { Test, TestingModule } from '@nestjs/testing'
import { TodosService } from '../service/todos.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Todo } from '../model/todos.entity'
import { mockTodoRepo } from './support/mocks'
import {
  createTodoDtoStub,
  todosArrayStub,
  todoStub,
  updateTodoDtoStub,
} from './support/stubs'

describe('TodosService', () => {
  let service: TodosService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: getRepositoryToken(Todo), useValue: mockTodoRepo },
      ],
    }).compile()

    service = module.get<TodosService>(TodosService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return array of todos', async () => {
      expect(await service.findAll()).toEqual(todosArrayStub)
      expect(mockTodoRepo.find).toHaveBeenCalledWith({})
    })

    it('should find todos with condition', async () => {
      const someCondition = { userID: 1 }
      expect(await service.findAll(someCondition)).toEqual(todosArrayStub)
      expect(mockTodoRepo.find).toHaveBeenCalledWith({ where: someCondition })
    })
  })

  describe('findOne', () => {
    it('should return a todo', async () => {
      expect(await service.findOne(1)).toEqual(todoStub)
      expect(mockTodoRepo.findOne).toHaveBeenCalledWith(1)
    })
  })

  describe('create', () => {
    it('should create a todo', async () => {
      expect(await service.create(createTodoDtoStub)).toEqual(todoStub)
      expect(mockTodoRepo.save).toHaveBeenCalledWith(createTodoDtoStub)
    })
  })

  describe('update', () => {
    it('should update a todo', async () => {
      expect(await service.update(1, updateTodoDtoStub)).toEqual(todoStub)
      expect(mockTodoRepo.update).toHaveBeenCalledWith(1, updateTodoDtoStub)
    })
  })

  describe('delete', () => {
    it('should delete a todo', async () => {
      expect(await service.delete(1)).toEqual(todoStub)
      expect(mockTodoRepo.createQueryBuilder).toHaveBeenCalled()
    })
  })
})
