import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common'
import { CreateTodoDto, UpdateTodoDto } from '../dto/'
import { TodosService } from '../service/todos.service'
import { Todo } from '../model/todos.entity'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { UsersService } from '../../users/service/users.service'
import { UsersController } from '../../users/controller/users.controller'

@ApiTags('todos')
@Controller()
export class TodosController {
  constructor(
    private readonly service: TodosService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async getAllAction(@Param('userID') userID?: string): Promise<Todo[]> {
    if (!userID) return this.service.findAll()

    const user = this.userService.findOne(+userID)

    if (!user) UsersController.throwNoIdError(userID)

    return this.service.findAll({ userID: +userID })
  }

  @Get(':id')
  async getOneAction(
    @Param('id') id: string,
    @Param('userID') userID?: string,
  ): Promise<Todo> {
    const todo = await this.service.findOne(+id)

    if (!todo) TodosController.throwNoIdError(id)

    if (userID && todo.userID !== +userID)
      TodosController.throwUserTodoNotFound(id, userID)

    return todo
  }

  @ApiBody({ type: CreateTodoDto })
  @Post()
  async createAction(
    @Body() todo: CreateTodoDto,
    @Param('userID') userID?: string,
  ): Promise<Todo> {
    return this.service.create({ userID: +userID, ...todo })
  }

  @Put(':id')
  @ApiBody({ type: UpdateTodoDto })
  async putAction(
    @Body() todo: UpdateTodoDto,
    @Param('id') id: string,
  ): Promise<Todo> {
    const todoData = await this.service.update(+id, todo)

    if (!todoData) TodosController.throwNoIdError(id)

    return todoData
  }

  @Patch(':id')
  @ApiBody({ type: UpdateTodoDto })
  async patchAction(
    @Body() todo: UpdateTodoDto,
    @Param('id') id: string,
  ): Promise<Todo> {
    const todos = await this.service.update(+id, todo)

    if (!todos) TodosController.throwNoIdError(id)

    return todos
  }

  @Delete(':id')
  async deleteAction(@Param('id') id: string): Promise<Todo> {
    const todos = await this.service.delete(+id)

    if (!todos) TodosController.throwNoIdError(id)

    return todos
  }

  private static throwNoIdError(id) {
    throw new HttpException(
      `Todo with id=${id} does not exist`,
      HttpStatus.NOT_FOUND,
    )
  }

  private static throwUserTodoNotFound(todoID, userID) {
    throw new HttpException(
      `Todo with id=${todoID} does not exist for user with id=${userID}`,
      HttpStatus.NOT_FOUND,
    )
  }
}
