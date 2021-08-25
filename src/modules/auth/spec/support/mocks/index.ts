import { CreateUserDto } from '../../../../users/dto/create-user.dto'
import { tokenStub } from '../stubs'
import { createMock } from '@golevelup/ts-jest'
import { ExecutionContext } from '@nestjs/common'

export const mockExecutionContext = {
  withValidToken: createMock<ExecutionContext>({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: `Bearer ${tokenStub}`,
        },
      }),
    }),
  }),
  withInvalidToken: createMock<ExecutionContext>({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: {
          authorization: 'aasdfsadfssdfsaf',
        },
      }),
    }),
  }),
}

export const mockJwtService = () => {
  return {
    verify: jest.fn().mockReturnValue({ id: 1, banned: false }),
  }
}

export const mockAuthService = () => {
  return {
    signup: jest.fn((dto: CreateUserDto) => {
      return { token: tokenStub }
    }),

    login: jest.fn((dto: CreateUserDto) => {
      return { token: tokenStub }
    }),
  }
}
