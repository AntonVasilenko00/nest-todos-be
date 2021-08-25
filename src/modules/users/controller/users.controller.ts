import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from '../service/users.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwtAuth.guard'
import { Roles } from '../../auth/decorators/roles-auth.decorator'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { AddRoleDto } from '../dto/add-role.dto'
import { BanUserDto } from '../dto/ban-user.dto'

@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll()
  }

  @Roles('ADMIN', 'AUTHOR')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id)

    if (!user) UsersController.throwNoIdError(id)

    return user
  }

  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id)

    if (!user) UsersController.throwNoIdError(id)

    return this.usersService.remove(+id)
  }

  @Roles('ADMIN')
  @Post(':id/role')
  addRole(@Body() dto: AddRoleDto, @Param('id') id: string) {
    return this.usersService.addRole({ ...dto, userID: +id })
  }

  @Roles('ADMIN')
  @Post(':id/ban')
  banUser(@Body() dto: BanUserDto, @Param('id') id: string) {
    return this.usersService.banUser({ id: +id, ...dto })
  }

  static throwNoIdError(id) {
    throw new HttpException(
      `User with id=${id} does not exist`,
      HttpStatus.NOT_FOUND,
    )
  }
}
