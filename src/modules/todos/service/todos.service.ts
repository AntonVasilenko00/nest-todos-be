import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Todo } from '../model/todos.entity'
import { Repository } from 'typeorm'
import { CreateTodoDto, UpdateTodoDto } from '../dto'

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly repo: Repository<Todo>,
  ) {}

  async findAll(condition?: Partial<CreateTodoDto>): Promise<Todo[]> {
    return this.repo.find(condition ? { where: condition } : {})
  }

  async findOne(id: number): Promise<Todo> {
    return this.repo.findOne(id)
  }

  async create(todo: CreateTodoDto): Promise<Todo> {
    return this.repo.save(todo)
  }

  async update(id: number, todo: UpdateTodoDto): Promise<Todo> {
    await this.repo.update(id, todo)

    return this.repo.findOne(id)
  }

  async delete(id: number): Promise<Todo> {
    return (
      await this.repo
        .createQueryBuilder()
        .delete()
        .whereInIds(id)
        .returning('*')
        .execute()
    ).raw[0]
  }
}
