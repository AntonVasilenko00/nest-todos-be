import { CreateTodoDto, UpdateTodoDto } from '../../../dto'
import { Todo } from '../../../model/todos.entity'
import { User } from '../../../../users/model/user.entity'

export const todoStub: Todo = {
  id: 1,
  userID: 1,
  isCompleted: false,
  text: 'asdf',
  user: new User(),
}
export const todosArrayStub: Todo[] = [todoStub]

export const createTodoDtoStub: CreateTodoDto = { userID: 1, text: 'asdf' }
export const updateTodoDtoStub: UpdateTodoDto = { isCompleted: false }
